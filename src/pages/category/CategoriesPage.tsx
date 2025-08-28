// pages/categories/index.tsx
import React, { useState } from 'react';
import {
  Card,
  Table,
  Button,
  Input,
  Select,
  Space,
  Tag,
  Popconfirm,
  Modal,
  Form,
  Switch,
  TreeSelect,
  Dropdown,
  Checkbox,
  message,
  Row,
  Col,
  Typography,
  Tooltip,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  PlusOutlined,
  SearchOutlined,
  ReloadOutlined,
  EditOutlined,
  DeleteOutlined,
  MoreOutlined,
  StarOutlined,
  StarFilled,
  EyeOutlined,
  FilterOutlined,
} from '@ant-design/icons';
import { useCategories, useCategoryTree, useCategoryOptions } from '@/hooks/useCategories';
import type { Category, CategoryFilters, CreateCategoryRequest, UpdateCategoryRequest } from '@/types/category';
import { TableRowSelection } from 'antd/es/table/interface';

const { Title } = Typography;
const { Option } = Select;

interface CategoryFormProps {
  open: boolean;
  onCancel: () => void;
  category?: Category;
  mode: 'create' | 'edit';
}

const CategoryForm: React.FC<CategoryFormProps> = ({ open, onCancel, category, mode }) => {
  const [form] = Form.useForm();
  const { createCategory, updateCategory } = useCategories();
  const { data: categoryOptions } = useCategoryOptions(true, category ? [category.id] : []);

  const handleSubmit = async (values: any) => {
    try {
      if (mode === 'create') {
        await createCategory.mutateAsync(values as CreateCategoryRequest);
      } else if (category) {
        await updateCategory.mutateAsync({
          id: category.id,
          data: values as UpdateCategoryRequest,
        });
      }
      form.resetFields();
      onCancel();
    } catch (error) {
      // Error handled in mutation
    }
  };

  React.useEffect(() => {
    if (open && category && mode === 'edit') {
      form.setFieldsValue({
        name: category.name,
        slug: category.slug,
        parent_id: category.parent_id || undefined,
        featured: category.featured,
        active: category.active,
      });
    } else if (open && mode === 'create') {
      form.resetFields();
    }
  }, [open, category, mode, form]);

  return (
    <Modal
      title={mode === 'create' ? 'Create Category' : 'Edit Category'}
      open={open}
      onCancel={onCancel}
      footer={null}
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          active: true,
          featured: false,
        }}
      >
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="name"
              label="Name"
              rules={[{ required: true, message: 'Please enter category name' }]}
            >
              <Input placeholder="Enter category name" />
            </Form.Item>
          </Col>
          
          <Col span={24}>
            <Form.Item
              name="slug"
              label="Slug"
              rules={[
                { pattern: /^[a-z0-9-]+$/, message: 'Slug must contain only lowercase letters, numbers, and hyphens' }
              ]}
            >
              <Input placeholder="Auto-generated if empty" />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item name="parent_id" label="Parent Category">
              <TreeSelect
                placeholder="Select parent category (optional)"
                allowClear
                showSearch
                treeDefaultExpandAll
                treeData={categoryOptions?.data?.map((option) => ({
                  title: '—'.repeat(option.level) + ' ' + option.label,
                  value: option.value,
                  key: option.value,
                }))}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="active" label="Active" valuePropName="checked">
              <Switch />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="featured" label="Featured" valuePropName="checked">
              <Switch />
            </Form.Item>
          </Col>
        </Row>

        <div style={{ textAlign: 'right', marginTop: 24 }}>
          <Space>
            <Button onClick={onCancel}>Cancel</Button>
            <Button 
              type="primary" 
              htmlType="submit"
              loading={createCategory.isPending || updateCategory.isPending}
            >
              {mode === 'create' ? 'Create' : 'Update'}
            </Button>
          </Space>
        </div>
      </Form>
    </Modal>
  );
};

const CategoriesPage: React.FC = () => {
  const [filters, setFilters] = useState<CategoryFilters>({
    page: 1,
    per_page: 15,
    sort_field: 'created_at',
    sort_direction: 'desc',
  });
  
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);
  const [formModal, setFormModal] = useState<{
    open: boolean;
    mode: 'create' | 'edit';
    category?: Category;
  }>({
    open: false,
    mode: 'create',
  });
  
  const [showFilters, setShowFilters] = useState(false);

  const {
    categories,
    total,
    currentPage,
    perPage,
    lastPage,
    isLoading,
    isError,
    refetch,
    deleteCategory,
    bulkUpdateStatus,
    bulkDelete,
  } = useCategories(filters);

  const { data: categoryOptions } = useCategoryOptions(false);

  const handleTableChange = (pagination: any, _: any, sorter: any) => {
    const newFilters: CategoryFilters = {
      ...filters,
      page: pagination.current,
      per_page: pagination.pageSize,
    };

    if (sorter.field && sorter.order) {
      newFilters.sort_field = sorter.field;
      newFilters.sort_direction = sorter.order === 'ascend' ? 'asc' : 'desc';
    }

    setFilters(newFilters);
  };

  const handleSearch = (value: string) => {
    setFilters({
      ...filters,
      search: value || undefined,
      page: 1,
    });
  };

  const handleFilterChange = (key: keyof CategoryFilters, value: any) => {
    setFilters({
      ...filters,
      [key]: value === '' ? undefined : value,
      page: 1,
    });
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteCategory.mutateAsync(id);
    } catch (error) {
      // Error handled in mutation
    }
  };

  const handleBulkAction = async (action: 'activate' | 'deactivate' | 'delete') => {
    if (selectedRowKeys.length === 0) {
      message.warning('Please select items first');
      return;
    }

    try {
      switch (action) {
        case 'activate':
          await bulkUpdateStatus.mutateAsync({
            category_ids: selectedRowKeys,
            status: 'active',
          });
          break;
        case 'deactivate':
          await bulkUpdateStatus.mutateAsync({
            category_ids: selectedRowKeys,
            status: 'inactive',
          });
          break;
        case 'delete':
          await bulkDelete.mutateAsync({
            category_ids: selectedRowKeys,
          });
          break;
      }
      setSelectedRowKeys([]);
    } catch (error) {
      // Error handled in mutations
    }
  };

  const rowSelection: TableRowSelection<Category> = {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_INVERT,
      Table.SELECTION_NONE,
    ],
  } as any;

  const columns: ColumnsType<Category> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: true,
      render: (text: string, record: Category) => (
        <Space>
          <span style={{ marginLeft: record.level ? record.level * 20 : 0 }}>
            {record.level && record.level > 0 && '└─ '}
            {text}
          </span>
          {record.featured && (
            <Tooltip title="Featured">
              <StarFilled style={{ color: '#faad14' }} />
            </Tooltip>
          )}
        </Space>
      ),
    },
    {
      title: 'Slug',
      dataIndex: 'slug',
      key: 'slug',
      sorter: true,
    },
    {
      title: 'Parent',
      dataIndex: ['parent', 'name'],
      key: 'parent',
      render: (text: string) => text || '-',
    },
    {
      title: 'Children',
      dataIndex: 'children_count',
      key: 'children_count',
      render: (count: number) => count || 0,
    },
    {
      title: 'Status',
      dataIndex: 'active',
      key: 'active',
      sorter: true,
      render: (active: boolean) => (
        <Tag color={active ? 'success' : 'error'}>
          {active ? 'Active' : 'Inactive'}
        </Tag>
      ),
    },
    {
      title: 'Featured',
      dataIndex: 'featured',
      key: 'featured',
      sorter: true,
      render: (featured: boolean) => (
        <Tag color={featured ? 'gold' : 'default'}>
          {featured ? 'Yes' : 'No'}
        </Tag>
      ),
    },
    {
      title: 'Created',
      dataIndex: 'created_at',
      key: 'created_at',
      sorter: true,
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_, record: Category) => (
        <Space size="small">
          <Tooltip title="Edit">
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={() => setFormModal({
                open: true,
                mode: 'edit',
                category: record,
              })}
            />
          </Tooltip>
          <Popconfirm
            title="Delete category"
            description="Are you sure you want to delete this category?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Tooltip title="Delete">
              <Button
                type="text"
                size="small"
                danger
                icon={<DeleteOutlined />}
                loading={deleteCategory.isPending}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const bulkActionItems = [
    {
      key: 'activate',
      label: 'Activate Selected',
      onClick: () => handleBulkAction('activate'),
    },
    {
      key: 'deactivate',
      label: 'Deactivate Selected',
      onClick: () => handleBulkAction('deactivate'),
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'delete',
      label: 'Delete Selected',
      danger: true,
      onClick: () => {
        Modal.confirm({
          title: 'Delete Categories',
          content: `Are you sure you want to delete ${selectedRowKeys.length} selected categories?`,
          onOk: () => handleBulkAction('delete'),
        });
      },
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Row justify="space-between" align="middle">
            <Col>
              <Title level={4} style={{ margin: 0 }}>
                Categories
              </Title>
            </Col>
            <Col>
              <Space>
                <Button
                  icon={<FilterOutlined />}
                  onClick={() => setShowFilters(!showFilters)}
                >
                  Filters
                </Button>
                <Button
                  icon={<ReloadOutlined />}
                  onClick={() => refetch()}
                  loading={isLoading}
                >
                  Refresh
                </Button>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => setFormModal({
                    open: true,
                    mode: 'create',
                  })}
                >
                  Add Category
                </Button>
              </Space>
            </Col>
          </Row>
        </div>

        {showFilters && (
          <Card size="small" style={{ marginBottom: 16, backgroundColor: '#fafafa' }}>
            <Row gutter={16}>
              <Col span={6}>
                <Input
                  placeholder="Search categories..."
                  prefix={<SearchOutlined />}
                  value={filters.search}
                  onChange={(e) => handleSearch(e.target.value)}
                  allowClear
                />
              </Col>
              <Col span={6}>
                <TreeSelect
                  placeholder="Filter by parent"
                  allowClear
                  value={filters.parent_id}
                  onChange={(value) => handleFilterChange('parent_id', value)}
                  treeData={categoryOptions?.data?.map((option) => ({
                    title: '—'.repeat(option.level) + ' ' + option.label,
                    value: option.value,
                    key: option.value,
                  }))}
                />
              </Col>
              <Col span={4}>
                <Select
                  placeholder="Status"
                  allowClear
                  value={filters.status}
                  onChange={(value) => handleFilterChange('status', value)}
                  style={{ width: '100%' }}
                >
                  <Option value="active">Active</Option>
                  <Option value="inactive">Inactive</Option>
                </Select>
              </Col>
              <Col span={4}>
                <Select
                  placeholder="Featured"
                  allowClear
                  value={filters.featured}
                  onChange={(value) => handleFilterChange('featured', value)}
                  style={{ width: '100%' }}
                >
                  <Option value={true}>Featured</Option>
                  <Option value={false}>Not Featured</Option>
                </Select>
              </Col>
              <Col span={4}>
                <Select
                  placeholder="Sort by"
                  value={`${filters.sort_field}-${filters.sort_direction}`}
                  onChange={(value) => {
                    const [field, direction] = value.split('-');
                    setFilters({
                      ...filters,
                      sort_field: field as any,
                      sort_direction: direction as 'asc' | 'desc',
                    });
                  }}
                  style={{ width: '100%' }}
                >
                  <Option value="name-asc">Name A-Z</Option>
                  <Option value="name-desc">Name Z-A</Option>
                  <Option value="created_at-desc">Newest First</Option>
                  <Option value="created_at-asc">Oldest First</Option>
                </Select>
              </Col>
            </Row>
          </Card>
        )}

        {selectedRowKeys.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <Space>
              <span>{selectedRowKeys.length} items selected</span>
              <Dropdown menu={{ items: bulkActionItems }} placement="bottomLeft">
                <Button icon={<MoreOutlined />}>
                  Bulk Actions
                </Button>
              </Dropdown>
            </Space>
          </div>
        )}

        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={categories}
          rowKey="id"
          loading={isLoading}
          onChange={handleTableChange}
          pagination={{
            current: currentPage,
            pageSize: perPage,
            total: total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} items`,
            pageSizeOptions: ['10', '15', '25', '50', '100'],
          }}
          scroll={{ x: 1000 }}
        />
      </Card>

      <CategoryForm
        open={formModal.open}
        onCancel={() => setFormModal({ ...formModal, open: false })}
        category={formModal.category}
        mode={formModal.mode}
      />
    </div>
  );
};

export default CategoriesPage;