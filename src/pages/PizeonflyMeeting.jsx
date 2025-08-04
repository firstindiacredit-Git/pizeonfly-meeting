import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Form, 
  Input, 
  Select, 
  Checkbox, 
  Button, 
  Card, 
  Row, 
  Col, 
  Typography, 
  Divider,
  TimePicker,
  Space,
  Tag,
  Alert,
  Steps,
  Progress
} from 'antd';
import { 
  CalendarOutlined, 
  ClockCircleOutlined, 
  UserOutlined, 
  MailOutlined, 
  PhoneOutlined,
  DollarOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const CreateMeeting = () => {
  const [form] = Form.useForm();
  const currentAdminUserId = JSON.parse(localStorage.getItem('user'))?._id;

  const [currentStep, setCurrentStep] = useState(0);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [meetingData, setMeetingData] = useState({
    title: "Consultation Call",
    description: "",
    date: "",
    startTime: "",
    duration: 30,
    guestName: "",
    guestEmail: "",
    guestPhone: "",
    additionalGuests: [],
    currentRevenue: "",
    revenueGoal: "",
    businessStruggle: "",
    confirmAttendance: false,
    organizer: currentAdminUserId || null,
    agreedToTerms: false
  });

  const timeSlots = [
    "9:30am", "10:00am", "10:30am", "11:00am", "11:30am",
    "12:00pm", "12:30pm", "1:00pm", "2:00pm", "2:30pm",
    "3:00pm", "3:30pm", "4:00pm", "4:30pm", "5:00pm"
  ];

  const location = useLocation();
  const { isRescheduling, meetingData: reschedulingData } = location.state || {};
  const navigate = useNavigate();

  useEffect(() => {
    if (isRescheduling && reschedulingData) {
      setMeetingData(reschedulingData);
    }
  }, [isRescheduling, reschedulingData]);

  // Update form when meetingData changes
  useEffect(() => {
    form.setFieldsValue({
      title: meetingData.title,
      duration: meetingData.duration,
      guestName: meetingData.guestName,
      guestEmail: meetingData.guestEmail,
      guestPhone: meetingData.guestPhone,
      currentRevenue: meetingData.currentRevenue,
      revenueGoal: meetingData.revenueGoal,
      businessStruggle: meetingData.businessStruggle,
      description: meetingData.description,
      confirmAttendance: meetingData.confirmAttendance || false,
      agreedToTerms: meetingData.agreedToTerms || false
    });
  }, [meetingData, form]);

  const steps = [
    {
      title: 'Select Date & Time',
      icon: <CalendarOutlined />,
      content: 'Choose your preferred date and time for the consultation'
    },
    {
      title: 'Enter Details',
      icon: <UserOutlined />,
      content: 'Fill in your information and business details'
    },
    {
      title: 'Confirm Booking',
      icon: <CheckCircleOutlined />,
      content: 'Review and confirm your meeting'
    }
  ];

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setMeetingData(prev => ({ ...prev, date: date }));
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    setMeetingData(prev => ({ ...prev, startTime: time }));
  };

  const handleFormChange = (changedValues, allValues) => {
    // console.log('Form changed:', changedValues, allValues); // Debug log
    // console.log('Current meetingData:', meetingData); // Debug log
    
    // Update meetingData with all form values
    setMeetingData(prev => {
      const updated = { ...prev, ...allValues };
      // console.log('Updated meetingData:', updated); // Debug log
      return updated;
    });
    
    // Also update the form fields to ensure consistency
    Object.keys(changedValues).forEach(key => {
      if (changedValues[key] !== undefined) {
        form.setFieldsValue({ [key]: changedValues[key] });
      }
    });
  };

  const updateFormField = (field, value) => {
    setMeetingData(prev => ({ ...prev, [field]: value }));
    form.setFieldsValue({ [field]: value });
  };

  const syncFormData = () => {
    // Get all current form values and sync with meetingData
    const formValues = form.getFieldsValue();
    // console.log('Current form values:', formValues);
    setMeetingData(prev => ({ ...prev, ...formValues }));
  };

  const handleNext = () => {
    if (currentStep === 0) {
      if (!selectedDate || !selectedTime) {
        toast.error("Please select both date and time");
        return;
      }
    } else if (currentStep === 1) {
      // Sync form data first
      syncFormData();
      
      // Validate required fields before proceeding to confirmation step
      const requiredFields = ['title', 'guestName', 'guestEmail', 'guestPhone', 'currentRevenue', 'revenueGoal', 'businessStruggle'];
      const missingFields = requiredFields.filter(field => !meetingData[field]);
      
      if (missingFields.length > 0) {
        // console.log('Missing fields:', missingFields);
        // console.log('Current meetingData:', meetingData);
        toast.error(`Please fill in all required fields: ${missingFields.join(', ')}`);
        return;
      }
    }
    setCurrentStep(currentStep + 1);
  };

  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (values) => {
    // Get all form values
    const formData = { ...meetingData, ...values };
    
    if (!formData.agreedToTerms) {
      toast.error("Please agree to the terms and conditions");
      return;
    }

    // Validate required fields
    const requiredFields = ['title', 'guestName', 'guestEmail', 'guestPhone', 'currentRevenue', 'revenueGoal', 'businessStruggle'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      // console.log('Missing fields:', missingFields);
      // console.log('Form data:', formData);
      toast.error(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }

    if (!selectedDate || !selectedTime) {
      toast.error("Please select both date and time");
      return;
    }

    setIsLoading(true);

    try {
      const finalData = {
        ...formData,
        date: selectedDate,
        startTime: selectedTime,
        duration: formData.duration || 30,
        confirmAttendance: formData.confirmAttendance || false,
        agreedToTerms: formData.agreedToTerms || false
      };

      // console.log('Submitting meeting data:', finalData); // Debug log
      // console.log('Form data:', formData); // Debug log
      // console.log('Meeting data state:', meetingData); // Debug log
      // console.log('Selected date:', selectedDate); // Debug log
      // console.log('Selected time:', selectedTime); // Debug log

      // Use a fallback URL if environment variable is not defined
      const baseUrl = 'https://crm.pizeonfly.com/';
      // console.log('Using base URL:', baseUrl); // Debug log
      
      let response;
      if (isRescheduling) {
        response = await axios.put(
          `${baseUrl}api/meetings/${formData._id}`,
          finalData
        );
      } else {
        response = await axios.post(
          `${baseUrl}api/client-create-meeting`,
          finalData
        );
      }

      if (response.data.success) {
        toast.success(isRescheduling ? "Meeting rescheduled successfully!" : "Meeting created successfully!");
        // Navigate to thank you page with meeting data
        navigate('/thank-you', { 
          state: { 
            meetingData: {
              ...finalData,
              _id: response.data.meeting?._id || 'N/A'
            }
          } 
        });
      }
    } catch (error) {
      console.error('API Error:', error); // Debug log
      toast.error(error.response?.data?.error || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Title level={2} className="text-blue-600">
                <CalendarOutlined className="mr-2" />
                Select Date & Time
              </Title>
              <Text className="text-gray-600">
                Choose your preferred date and time for the consultation call
              </Text>
            </div>

            <Row gutter={[24, 24]} className="items-start">
              <Col xs={24} lg={14}>
                <Card className="shadow-lg border-0">
                  <div className="custom-calendar">
                    <Calendar
                      onChange={handleDateChange}
                      value={selectedDate}
                      minDate={new Date()}
                      className="w-full"
                    />
                  </div>
                </Card>
              </Col>

              <Col xs={24} lg={10}>
                <Card className="shadow-lg border-0">
                  <div className="space-y-4">
                    <div>
                      <Text strong className="text-lg">Time Zone</Text>
                      <Select
                        defaultValue="Asia/Kolkata"
                        className="w-full mt-2"
                        size="large"
                      >
                        <Option value="Asia/Kolkata">India Standard Time (IST)</Option>
                        <Option value="America/New_York">Eastern Time (ET)</Option>
                        <Option value="America/Los_Angeles">Pacific Time (PT)</Option>
                        <Option value="Europe/London">British Time (GMT/BST)</Option>
                        <Option value="Asia/Dubai">Gulf Standard Time (GST)</Option>
                        <Option value="Asia/Singapore">Singapore Time (SGT)</Option>
                        <Option value="Australia/Sydney">Australian Eastern Time (AET)</Option>
                        <Option value="Europe/Paris">Central European Time (CET)</Option>
                        <Option value="Asia/Tokyo">Japan Standard Time (JST)</Option>
                      </Select>
                    </div>

                    {selectedDate && (
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <Text strong className="text-blue-600">
                          {selectedDate.toLocaleDateString('en-US', {
                            weekday: 'long',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </Text>
                      </div>
                    )}

                    <div>
                      <Text strong className="text-lg">Select Time</Text>
                      <div className="grid grid-cols-2 gap-2 mt-2 max-h-64 overflow-y-auto">
                        {timeSlots.map((time) => (
                          <Button
                            key={time}
                            type={selectedTime === time ? "primary" : "default"}
                            className={`h-12 ${selectedTime === time ? 'bg-blue-500' : 'hover:bg-blue-50'}`}
                            onClick={() => handleTimeSelect(time)}
                          >
                            <ClockCircleOutlined className="mr-1" />
                            {time}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Title level={2} className="text-green-600">
                <UserOutlined className="mr-2" />
                Enter Your Details
              </Title>
              <Text className="text-gray-600">
                Please provide your information and business details
              </Text>
            </div>

            <Form
              form={form}
              layout="vertical"
              onValuesChange={handleFormChange}
              initialValues={{
                title: meetingData.title,
                duration: meetingData.duration,
                guestName: meetingData.guestName,
                guestEmail: meetingData.guestEmail,
                guestPhone: meetingData.guestPhone,
                currentRevenue: meetingData.currentRevenue,
                revenueGoal: meetingData.revenueGoal,
                businessStruggle: meetingData.businessStruggle,
                description: meetingData.description,
                confirmAttendance: meetingData.confirmAttendance || false,
                agreedToTerms: meetingData.agreedToTerms || false
              }}
              onFinish={handleSubmit}
              className="max-w-4xl mx-auto"
            >
              <Row gutter={[24, 0]}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="title"
                    label={<Text strong>Meeting Title</Text>}
                    rules={[{ required: true, message: 'Please enter meeting title' }]}
                  >
                    <Input 
                      size="large" 
                      placeholder="e.g., Consultation Call"
                      prefix={<FileTextOutlined />}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    name="duration"
                    label={<Text strong>Duration</Text>}
                    rules={[{ required: true, message: 'Please select duration' }]}
                  >
                    <Select size="large" placeholder="Select duration">
                      <Option value={15}>15 minutes</Option>
                      <Option value={30}>30 minutes</Option>
                      <Option value={45}>45 minutes</Option>
                      <Option value={60}>60 minutes</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="guestName"
                label={<Text strong>Full Name</Text>}
                rules={[{ required: true, message: 'Please enter your name' }]}
              >
                <Input 
                  size="large" 
                  placeholder="e.g., John Doe"
                  prefix={<UserOutlined />}
                />
              </Form.Item>

              <Row gutter={[24, 0]}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="guestEmail"
                    label={<Text strong>Email Address</Text>}
                    rules={[
                      { required: true, message: 'Please enter your email' },
                      { type: 'email', message: 'Please enter a valid email' }
                    ]}
                  >
                    <Input 
                      size="large" 
                      placeholder="e.g., john.doe@example.com"
                      prefix={<MailOutlined />}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    name="guestPhone"
                    label={<Text strong>Phone Number</Text>}
                    rules={[{ required: true, message: 'Please enter your phone number' }]}
                  >
                    <Input 
                      size="large" 
                      placeholder="e.g., 9999999999"
                      prefix={<PhoneOutlined />}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={[24, 0]}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="currentRevenue"
                    label={<Text strong><DollarOutlined className="mr-1" />Current Monthly Revenue</Text>}
                    rules={[{ required: true, message: 'Please enter current revenue' }]}
                  >
                    <Input 
                      size="large" 
                      placeholder="e.g., $5000-$7000"
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    name="revenueGoal"
                    label={<Text strong><DollarOutlined className="mr-1" />Revenue Goal</Text>}
                    rules={[{ required: true, message: 'Please enter revenue goal' }]}
                  >
                    <Input 
                      size="large" 
                      placeholder="e.g., $10000 in 3 months"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="businessStruggle"
                label={<Text strong>Business Challenges</Text>}
                rules={[{ required: true, message: 'Please describe your business challenges' }]}
              >
                <TextArea 
                  rows={4}
                  placeholder="Describe your current business challenges and what you hope to achieve from this consultation..."
                />
              </Form.Item>

              <Form.Item
                name="description"
                label={<Text strong>Additional Notes (Optional)</Text>}
              >
                <TextArea 
                  rows={3}
                  placeholder="Any additional information you'd like to share..."
                />
              </Form.Item>

              <Alert
                message="Important Information"
                description="Please ensure all details are accurate. You will receive a confirmation email once the meeting is scheduled."
                type="info"
                showIcon
                className="mb-6"
              />
            </Form>
          </div>
        );

             case 2:
         return (
           <div className="space-y-6">
             <div className="text-center mb-8">
               <Title level={2} className="text-purple-600">
                 <CheckCircleOutlined className="mr-2" />
                 Confirm Your Booking
               </Title>
               <Text className="text-gray-600">
                 Please review your details and confirm the meeting
               </Text>
             </div>

             <Form
               form={form}
               layout="vertical"
               onValuesChange={handleFormChange}
               initialValues={{
                 title: meetingData.title,
                 duration: meetingData.duration,
                 guestName: meetingData.guestName,
                 guestEmail: meetingData.guestEmail,
                 guestPhone: meetingData.guestPhone,
                 currentRevenue: meetingData.currentRevenue,
                 revenueGoal: meetingData.revenueGoal,
                 businessStruggle: meetingData.businessStruggle,
                 description: meetingData.description,
                 confirmAttendance: meetingData.confirmAttendance || false,
                 agreedToTerms: meetingData.agreedToTerms || false
               }}
               onFinish={handleSubmit}
               className="max-w-4xl mx-auto"
             >
               <Card className="shadow-lg border-0">
                 <div className="space-y-6">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-4">
                       <div className="bg-blue-50 p-4 rounded-lg">
                         <Text strong className="text-blue-600">Meeting Details</Text>
                         <div className="mt-2 space-y-2">
                           <div><Text strong>Title:</Text> {meetingData.title}</div>
                           <div><Text strong>Date:</Text> {selectedDate?.toLocaleDateString()}</div>
                           <div><Text strong>Time:</Text> {selectedTime}</div>
                           <div><Text strong>Duration:</Text> {meetingData.duration} minutes</div>
                         </div>
                       </div>

                       <div className="bg-green-50 p-4 rounded-lg">
                         <Text strong className="text-green-600">Personal Information</Text>
                         <div className="mt-2 space-y-2">
                           <div><Text strong>Name:</Text> {meetingData.guestName}</div>
                           <div><Text strong>Email:</Text> {meetingData.guestEmail}</div>
                           <div><Text strong>Phone:</Text> {meetingData.guestPhone}</div>
                         </div>
                       </div>
                     </div>

                     <div className="space-y-4">
                       <div className="bg-orange-50 p-4 rounded-lg">
                         <Text strong className="text-orange-600">Business Information</Text>
                         <div className="mt-2 space-y-2">
                           <div><Text strong>Current Revenue:</Text> {meetingData.currentRevenue}</div>
                           <div><Text strong>Revenue Goal:</Text> {meetingData.revenueGoal}</div>
                         </div>
                       </div>

                       {meetingData.description && (
                         <div className="bg-purple-50 p-4 rounded-lg">
                           <Text strong className="text-purple-600">Additional Notes</Text>
                           <div className="mt-2">
                             <Text>{meetingData.description}</Text>
                           </div>
                         </div>
                       )}
                     </div>
                   </div>

                   <Divider />

                   <Form.Item
                     name="confirmAttendance"
                     valuePropName="checked"
                     rules={[{ required: true, message: 'Please confirm your attendance' }]}
                   >
                     <Checkbox 
                       checked={meetingData.confirmAttendance || false}
                       onChange={(e) => {
                         setMeetingData(prev => ({ ...prev, confirmAttendance: e.target.checked }));
                       }}
                     >
                       <Text>I confirm and agree to attend the call once I book</Text>
                     </Checkbox>
                   </Form.Item>

                   <Form.Item
                     name="agreedToTerms"
                     valuePropName="checked"
                     rules={[{ required: true, message: 'Please agree to the terms' }]}
                   >
                     <Checkbox 
                       checked={meetingData.agreedToTerms || false}
                       onChange={(e) => {
                         setMeetingData(prev => ({ ...prev, agreedToTerms: e.target.checked }));
                       }}
                     >
                       <Text>I agree to the Terms of Use and Privacy Notice</Text>
                     </Checkbox>
                   </Form.Item>

                   <Alert
                     message="What to Expect"
                     description="During this consultation, we'll discuss your business challenges, review your goals, and provide personalized recommendations to help you achieve your objectives."
                     type="success"
                     showIcon
                   />
                 </div>
               </Card>
             </Form>
           </div>
         );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <Title level={1} className="text-gray-800 mb-2">
              Schedule Your Consultation
            </Title>
            <Text className="text-gray-600 text-lg">
              Book a free consultation call with our business experts
            </Text>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <Progress 
              percent={((currentStep + 1) / steps.length) * 100} 
              strokeColor={{
                '0%': '#108ee9',
                '100%': '#87d068',
              }}
              showInfo={false}
            />
          </div>

          {/* Steps */}
          <div className="mb-8">
            <Steps current={currentStep} className="hidden md:block">
              {steps.map((step, index) => (
                <Steps.Step
                  key={index}
                  title={step.title}
                  description={step.content}
                  icon={step.icon}
                />
              ))}
            </Steps>
          </div>

          {/* Content */}
          <Card className="shadow-xl border-0">
            {renderStepContent()}
          </Card>

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <Button
              size="large"
              icon={<ArrowLeftOutlined />}
              onClick={handlePrev}
              disabled={currentStep === 0}
              className="flex items-center"
            >
              Previous
            </Button>

            {currentStep < steps.length - 1 ? (
              <Button
                type="primary"
                size="large"
                icon={<ArrowRightOutlined />}
                onClick={handleNext}
                className="flex items-center"
              >
                Next
              </Button>
            ) : (
              <Button
                type="primary"
                size="large"
                icon={<CheckCircleOutlined />}
                onClick={() => {
                  // Sync form data first
                  syncFormData();
                  
                  // Get all form values and submit
                  form.validateFields().then(values => {
                    // console.log('Form values before submit:', values);
                    // console.log('Meeting data state:', meetingData);
                    const combinedData = { ...meetingData, ...values };
                    // console.log('Combined data:', combinedData);
                    handleSubmit(combinedData);
                  }).catch(error => {
                    // console.log('Form validation failed:', error);
                  });
                }}
                loading={isLoading}
                className="flex items-center"
              >
                {isLoading ? 'Scheduling...' : 'Schedule Meeting'}
              </Button>
            )}
          </div>
        </div>
      </div>

      <ToastContainer />
      
      <style jsx>{`
        .custom-calendar {
          .react-calendar {
            width: 100%;
            border: none;
            border-radius: 12px;
            font-family: inherit;
          }

          .react-calendar__navigation {
            margin-bottom: 20px;
            height: 60px;
          }

          .react-calendar__navigation button {
            min-width: 50px;
            background: none;
            font-size: 18px;
            font-weight: 600;
            color: #333;
            padding: 15px;
            border-radius: 8px;
          }

          .react-calendar__navigation button:hover {
            background-color: #f0f0f0;
          }

          .react-calendar__month-view__weekdays {
            font-weight: 600;
            font-size: 14px;
            color: #666;
            text-transform: uppercase;
            padding: 12px 0;
          }

          .react-calendar__month-view__weekdays__weekday {
            text-align: center;
            padding: 8px 0;
          }

          .react-calendar__month-view__weekdays__weekday abbr {
            text-decoration: none;
            cursor: default;
          }

          .react-calendar__month-view__days {
            display: grid !important;
            grid-template-columns: repeat(7, 1fr);
            gap: 8px;
            padding: 12px;
          }

          .react-calendar__tile {
            aspect-ratio: 1/1;
            padding: 0;
            border-radius: 50%;
            font-weight: 500;
            font-size: 14px;
            transition: all 0.2s ease;
            height: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: auto;
            width: 50px;
          }

          .react-calendar__tile--active {
            background: #1890ff !important;
            color: white !important;
            border-radius: 50%;
          }

          .react-calendar__tile--now {
            background: #e6f7ff;
            color: #1890ff;
            border-radius: 50%;
            font-weight: bold;
          }

          .react-calendar__tile:hover {
            background-color: #f0f8ff !important;
            border-radius: 50%;
          }
        }
      `}</style>
    </div>
  );
};

export default CreateMeeting;
