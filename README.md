# Pizeonfly Meeting Scheduler

A modern, professional meeting scheduling application built with React, Ant Design, and Tailwind CSS.

## Features

- 🎨 **Modern UI/UX** - Beautiful design with Ant Design components and Tailwind CSS
- 📅 **Interactive Calendar** - Easy date and time selection
- 📝 **Multi-step Form** - Guided booking process with progress tracking
- 📧 **Email Notifications** - Automatic confirmation emails to clients and admins
- 📱 **Responsive Design** - Works perfectly on all devices
- 🔒 **No Login Required** - Anyone can schedule meetings without registration

## Installation

1. **Install Dependencies**
   ```bash
   npm install antd @ant-design/icons react-toastify tailwindcss @tailwindcss/forms autoprefixer postcss
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Build for Production**
   ```bash
   npm run build
   ```

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_BASE_URL=http://localhost:5000/
```

## Key Features

### 🎯 **Step-by-Step Booking Process**
- **Step 1**: Select date and time from interactive calendar
- **Step 2**: Enter personal and business information
- **Step 3**: Review and confirm booking

### 📧 **Automatic Email Notifications**
- **Client Email**: Beautiful confirmation with meeting details
- **Admin Email**: Detailed notification with all client information

### 🎨 **Modern Design**
- Ant Design components for professional look
- Tailwind CSS for custom styling
- Responsive design for all devices
- Progress tracking and visual feedback

### ⚡ **Performance**
- Fast loading with Vite
- Optimized bundle size
- Smooth animations and transitions

## Technology Stack

- **Frontend**: React 19, Vite
- **UI Framework**: Ant Design
- **Styling**: Tailwind CSS
- **Icons**: Ant Design Icons
- **Notifications**: React Toastify
- **Calendar**: React Calendar
- **HTTP Client**: Axios

## Project Structure

```
src/
├── App.jsx              # Main application component
├── App.css              # Global styles with Tailwind
├── main.jsx             # Application entry point
└── pages/
    └── PizeonflyMeeting.jsx  # Meeting scheduler component
```

## Customization

### Colors
Update the color scheme in `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Your custom colors
      },
    },
  },
},
```

### Styling
Custom styles can be added in `src/App.css`:

```css
/* Custom component styles */
.custom-calendar {
  /* Your custom styles */
}
```

## API Integration

The application connects to your backend API for:
- Creating meetings (`POST /api/create-meeting`)
- Updating meetings (`PUT /api/meetings/:id`)
- Fetching meetings (`GET /api/client-meetings`)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.
