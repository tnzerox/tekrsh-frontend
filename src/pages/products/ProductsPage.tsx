
import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  Input, 
  Space, 
  Modal, 
  Form, 
  Select, 
  InputNumber, 
  message,
  Popconfirm,
  Card,
  Row,
  Col,
  Tag,
  Tooltip
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  SearchOutlined,
  ReloadOutlined 
} from '@ant-design/icons';
import type { ColumnsType, TableProps } from 'antd/es/table';
import { useProducts } from '@/hooks/useProducts';
import { useAuth } from '@/hooks/useAuth';
import { Product, CreateProductRequest, UpdateProductRequest, ProductFilters } from '@/types/product';
import { PERMISSIONS } from '@/utils/constants';

const { Option } = Select;

export const ProductsPage: React.FC = () => {
  const { checkPermission } = useAuth();
  const [filters, setFilters] = useState<ProductFilters>({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form] = Form.useForm();

  const {
    products,
    total,
    currentPage,
    perPage,
    isLoading,
    refetch,
    createProduct,
    updateProduct,
    deleteProduct,
  } = useProducts(filters);

  const canManageProducts = checkPermission(PERMISSIONS.VIEW_DASHBOARD);
  const canViewProducts = checkPermission(PERMISSIONS.VIEW_DASHBOARD);

  useEffect(() => {
    if (!canViewProducts) {
      message.error('You do not have permission to view products');
    }
  }, [canViewProducts]);

  const handleSearch = (value: string) => {
    setFilters(prev => ({ ...prev, search: value }));
  };

  const handleFilterChange = (key: keyof ProductFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    form.setFieldsValue(product);
    setIsModalVisible(true);
  };

  const handleDeleteProduct = async (id: number) => {
    try {
      await deleteProduct.mutateAsync(id);
      message.success('Product deleted successfully');
    } catch (error) {
      message.error('Failed to delete product');
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingProduct) {
        await updateProduct.mutateAsync({ 
          id: editingProduct.id, 
          data: values as UpdateProductRequest 
        });
        message.success('Product updated successfully');
      } else {
        await createProduct.mutateAsync(values as CreateProductRequest);
        message.success('Product created successfully');
      }
      
      setIsModalVisible(false);
      form.resetFields();
      setEditingProduct(null);
    } catch (error: any) {
      if (error.errorFields) {
        message.error('Please fill in all required fields');
      } else {
        message.error('Failed to save product');
      }
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setEditingProduct(null);
  };

  const columns: ColumnsType<Product> = [
    {
      title: 'SKU',
      dataIndex: 'sku',
      key: 'sku',
      width: 120,
      sorter: true,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: true,
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Search name"
            value={selectedKeys[0] as string}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => confirm()}
            style={{ marginBottom: 8, display: 'block' }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => confirm()}
              icon={<SearchOutlined />}
              size="small"
            >
              Search
            </Button>
            <Button onClick={() => clearFilters?.()} size="small">
              Reset
            </Button>
          </Space>
        </div>
      ),
      filterIcon: (filtered: boolean) => (
        <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
      ),
    },
    {
      title: 'Category',
      dataIndex: ['category', 'name'],
      key: 'category',
      render: (categoryName: string) => categoryName || 'N/A',
      filters: [
        { text: 'Electronics', value: 1 },
        { text: 'Clothing', value: 2 },
        { text: 'Books', value: 3 },
      ],
      onFilter: (value, record) => record.category_id === value,
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `$${price.toFixed(2)}`,
      sorter: true,
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Space direction="vertical">
            <InputNumber
              placeholder="Min price"
              value={selectedKeys[0] as number}
              onChange={(value) => setSelectedKeys(value ? [value] : [])}
              style={{ width: '100%' }}
            />
            <InputNumber
              placeholder="Max price"
              value={selectedKeys[1] as number}
              onChange={(value) => {
                const keys = [...selectedKeys];
                keys[1] = value || undefined;
                setSelectedKeys(keys.filter(Boolean));
              }}
              style={{ width: '100%' }}
            />
            <Space>
              <Button
                type="primary"
                onClick={() => confirm()}
                size="small"
              >
                Filter
              </Button>
              <Button onClick={() => clearFilters?.()} size="small">
                Reset
              </Button>
            </Space>
          </Space>
        </div>
      ),
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
      key: 'stock',
      sorter: true,
      render: (stock: number) => (
        <Tag color={stock > 10 ? 'green' : stock > 0 ? 'orange' : 'red'}>
          {stock}
        </Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status.toUpperCase()}
        </Tag>
      ),
      filters: [
        { text: 'Active', value: 'active' },
        { text: 'Inactive', value: 'inactive' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_, record: Product) => (
        <Space size="middle">
          {canManageProducts && (
            <>
              <Tooltip title="Edit">
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  size="small"
                  onClick={() => handleEditProduct(record)}
                />
              </Tooltip>
              <Tooltip title="Delete">
                <Popconfirm
                  title="Are you sure you want to delete this product?"
                  onConfirm={() => handleDeleteProduct(record.id)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button
                    type="primary"
                    danger
                    icon={<DeleteOutlined />}
                    size="small"
                  />
                </Popconfirm>
              </Tooltip>
            </>
          )}
        </Space>
      ),
    },
  ];

  const handleTableChange: TableProps<Product>['onChange'] = (pagination, filters, sorter) => {
    const newFilters: ProductFilters = {};
    
    // Handle pagination
    if (pagination?.current) {
      newFilters.page = pagination.current;
    }
    
    // Handle filters
    Object.entries(filters || {}).forEach(([key, value]) => {
      if (value && value.length > 0) {
        if (key === 'category') {
          newFilters.category_id = value[0] as number;
        } else if (key === 'status') {
          newFilters.status = value[0] as 'active' | 'inactive';
        }
      }
    });
    
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  if (!canViewProducts) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Access Denied</h3>
          <p className="text-gray-600">You don't have permission to view products.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600">Manage your product inventory</p>
        </div>
        {canManageProducts && (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddProduct}
            size="large"
          >
            Add Product
          </Button>
        )}
      </div>

      <Card>
        <Row gutter={[16, 16]} className="mb-4">
          <Col xs={24} sm={12} md={8} lg={6}>
            <Input.Search
              placeholder="Search products..."
              allowClear
              onSearch={handleSearch}
              style={{ width: '100%' }}
            />
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Select
              placeholder="Filter by status"
              allowClear
              style={{ width: '100%' }}
              onChange={(value) => handleFilterChange('status', value)}
            >
              <Option value="active">Active</Option>
              <Option value="inactive">Inactive</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Select
              placeholder="Filter by category"
              allowClear
              style={{ width: '100%' }}
              onChange={(value) => handleFilterChange('category_id', value)}
            >
              <Option value={1}>Electronics</Option>
              <Option value={2}>Clothing</Option>
              <Option value={3}>Books</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Button
              icon={<ReloadOutlined />}
              onClick={() => refetch()}
              loading={isLoading}
            >
              Refresh
            </Button>
          </Col>
        </Row>

        <Table<Product>
          columns={columns}
          dataSource={products}
          rowKey="id"
          loading={isLoading}
          onChange={handleTableChange}
          pagination={{
            current: currentPage,
            total: total,
            pageSize: perPage,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} items`,
          }}
          scroll={{ x: 800 }}
        />
      </Card>

      <Modal
        title={editingProduct ? 'Edit Product' : 'Add Product'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        confirmLoading={editingProduct ? updateProduct.isPending : createProduct.isPending}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ status: 'active' }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Product Name"
                rules={[{ required: true, message: 'Please enter product name' }]}
              >
                <Input placeholder="Enter product name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="sku"
                label="SKU"
                rules={[{ required: true, message: 'Please enter SKU' }]}
              >
                <Input placeholder="Enter SKU" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please enter description' }]}
          >
            <Input.TextArea rows={3} placeholder="Enter product description" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="price"
                label="Price"
                rules={[{ required: true, message: 'Please enter price' }]}
              >
                <InputNumber
                  min={0}
                  step={0.01}
                  precision={2}
                  style={{ width: '100%' }}
                  placeholder="0.00"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="stock"
                label="Stock"
                rules={[{ required: true, message: 'Please enter stock' }]}
              >
                <InputNumber
                  min={0}
                  style={{ width: '100%' }}
                  placeholder="0"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="category_id"
                label="Category"
                rules={[{ required: true, message: 'Please select category' }]}
              >
                <Select placeholder="Select category">
                  <Option value={1}>Electronics</Option>
                  <Option value={2}>Clothing</Option>
                  <Option value={3}>Books</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: 'Please select status' }]}
          >
            <Select placeholder="Select status">
              <Option value="active">Active</Option>
              <Option value="inactive">Inactive</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal> */}
    </div>
  );
};
