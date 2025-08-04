import React from 'react';
import { Card, Typography, Button, Row, Col, Divider } from 'antd';
import { CheckCircleOutlined, CalendarOutlined, ClockCircleOutlined, UserOutlined, MailOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';

const { Title, Text, Paragraph } = Typography;

const ThankYouPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { meetingData } = location.state || {};

  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="mb-6">
              <CheckCircleOutlined className="text-6xl text-green-500" />
            </div>
            <Title level={1} className="text-gray-800 mb-4">
              Thank You for Scheduling!
            </Title>
            <Text className="text-gray-600 text-lg">
              Your consultation call has been successfully scheduled. We're excited to help you achieve your business goals!
            </Text>
          </div>

          {/* Meeting Details Card */}
          {meetingData && (
            <Card className="shadow-lg border-0 mb-8">
              <div className="text-center mb-6">
                <Title level={2} className="text-blue-600">
                  Meeting Confirmation
                </Title>
              </div>

              <Row gutter={[24, 24]}>
                <Col xs={24} md={12}>
                  <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-center mb-2">
                        <CalendarOutlined className="text-blue-500 mr-2" />
                        <Text strong className="text-blue-600">Meeting Details</Text>
                      </div>
                      <div className="space-y-2">
                        <div><Text strong>Title:</Text> {meetingData.title}</div>
                        <div><Text strong>Date:</Text> {formatDate(meetingData.date)}</div>
                        <div><Text strong>Time:</Text> {meetingData.startTime}</div>
                        <div><Text strong>Duration:</Text> {meetingData.duration} minutes</div>
                      </div>
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="flex items-center mb-2">
                        <UserOutlined className="text-green-500 mr-2" />
                        <Text strong className="text-green-600">Your Information</Text>
                      </div>
                      <div className="space-y-2">
                        <div><Text strong>Name:</Text> {meetingData.guestName}</div>
                        <div><Text strong>Email:</Text> {meetingData.guestEmail}</div>
                        <div><Text strong>Phone:</Text> {meetingData.guestPhone}</div>
                      </div>
                    </div>
                  </div>
                </Col>

                <Col xs={24} md={12}>
                  <div className="space-y-4">
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <div className="flex items-center mb-2">
                        <ClockCircleOutlined className="text-orange-500 mr-2" />
                        <Text strong className="text-orange-600">Business Information</Text>
                      </div>
                      <div className="space-y-2">
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
                </Col>
              </Row>
            </Card>
          )}

          {/* What's Next Section */}
          <Card className="shadow-lg border-0 mb-8">
            <div className="text-center mb-6">
              <Title level={2} className="text-gray-800">
                What Happens Next?
              </Title>
            </div>

            <Row gutter={[24, 24]}>
              <Col xs={24} md={8}>
                <div className="text-center p-4">
                  <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MailOutlined className="text-2xl text-blue-600" />
                  </div>
                  <Title level={4} className="text-blue-600 mb-2">Email Confirmation</Title>
                  <Text className="text-gray-600">
                    You'll receive a detailed confirmation email with meeting details and preparation tips.
                  </Text>
                </div>
              </Col>

                             <Col xs={24} md={8}>
                 <div className="text-center p-4">
                   <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                     <ClockCircleOutlined className="text-2xl text-green-600" />
                   </div>
                   <Title level={4} className="text-green-600 mb-2">Email Reminders</Title>
                   <Text className="text-gray-600">
                     We'll send you email reminders 24 hours before your scheduled call.
                   </Text>
                 </div>
               </Col>

              <Col xs={24} md={8}>
                <div className="text-center p-4">
                  <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <UserOutlined className="text-2xl text-purple-600" />
                  </div>
                  <Title level={4} className="text-purple-600 mb-2">Expert Consultation</Title>
                  <Text className="text-gray-600">
                    Our business experts will call you at the scheduled time to discuss your goals.
                  </Text>
                </div>
              </Col>
            </Row>
          </Card>

          {/* Important Notes */}
          <Card className="shadow-lg border-0 mb-8">
            <div className="text-center mb-6">
              <Title level={2} className="text-gray-800">
                Important Information
              </Title>
            </div>

            <div className="space-y-4">
              <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
                <Text strong className="text-yellow-800">📞 Call Preparation</Text>
                <div className="mt-2 text-yellow-700">
                  <ul className="list-disc list-inside space-y-1">
                    <li>Please join the call 5 minutes before the scheduled time</li>
                    <li>Ensure you have a stable internet connection</li>
                    <li>Have your questions and business challenges ready</li>
                    <li>Find a quiet environment for the consultation</li>
                  </ul>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                <Text strong className="text-blue-800">📧 Communication</Text>
                <div className="mt-2 text-blue-700">
                  <ul className="list-disc list-inside space-y-1">
                    <li>Check your email for the meeting link and details</li>
                    <li>If you need to reschedule, contact us at least 24 hours in advance</li>
                    <li>For urgent changes, call us at +1 (234) 567-890</li>
                  </ul>
                </div>
              </div>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="text-center space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                type="primary" 
                size="large"
                onClick={() => navigate('/')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Back to Home
              </Button>
              
              <Button 
                size="large"
                onClick={() => navigate('/schedule-meeting')}
                className="border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                Schedule Another Meeting
              </Button>
            </div>

            <div className="text-gray-500 text-sm">
              <Text>Meeting ID: {meetingData?._id || 'N/A'}</Text>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThankYouPage; 