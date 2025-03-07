const columns = [
    {
      title: "Proposal Number",
      dataIndex: "proposal_number",
      key: "proposal_number",
    },
    {
      title: "FBO Name",
      dataIndex: "fbo_name",
      key: "fbo_name",
    },
    // {
    //   title: "Date Created",
    //   dataIndex: "date_created",
    //   key: "date_created",
    //   render: (date) => moment(date).format("DD-MM-YYYY"), // Formatting the date if needed
    // },
    {
      title: "Total No. of Outlets",
      dataIndex: "totalOutlets",
      key: "totalOutlets",
    },
    {
      title: "Outlets Pending for Invoicing",
      dataIndex: "outletPendingForInvoice",
      key: "outletPendingForInvoice",
    },
    {
      title: "Proposal Value",
      dataIndex: "proposal_value",
      key: "proposal_value",
    },
    {
      title: "Payment Received",
      dataIndex: "payment_received",
      key: "payment_received",
    },
    {
      title: "Pending Amount",
      dataIndex: "pending_amount",
      key: "pending_amount",
    },
    {
      title: "Assigned Representative",
      dataIndex: "assigned_representative",
      key: "assigned_representative",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status, record) => {
        const statusOptions = [
          "Mail Sent",
          "Mail not sent",
          "Partial Invoiced",
          "Sale closed",
          "Dropped",
          "Pending",
        ];
  
        const getTagColor = (option) => {
          switch (option) {
            case "Mail Sent":
              return "volcano";
            case "Partial Invoiced":
            case "Sale Closed":
              return "green";
            case "Dropped":
              return "red";
            case "Mail not sent":
            case "Pending":
              return "grey";
            default:
              return "blue";
          }
        };
  
        return (
          <Select
            value={status}
            style={{
              minWidth: "120px",
              border: "none",
              padding: "0",
            }}
            dropdownStyle={{
              border: "none", // Remove border from dropdown
            }}
            onChange={(value) => handleStatusChange(value, record)}
          >
            {statusOptions.map((option) => (
              <Select.Option key={option} value={option}>
                <Tag color={getTagColor(option)}>{option.toUpperCase()}</Tag>
              </Select.Option>
            ))}
          </Select>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Dropdown
          overlay={menu(record)}
          trigger={["click"]}
          placement="bottomLeft"
          arrow
          danger
        >
          <Button type="link" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];