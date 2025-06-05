import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { toggleTheme } from "../context/themeSlice";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaLinkedin,
  FaTwitter,
  FaGithub,
  FaTelegram,
  FaWhatsapp,
} from "react-icons/fa";
import {
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  ClockIcon,
  CheckCircleIcon,
  PaperAirplaneIcon,
  ChatBubbleLeftRightIcon,
  CalendarDaysIcon,
  UserGroupIcon,
  ChartBarIcon,
  SunIcon,
  MoonIcon,
  ExclamationTriangleIcon,
  SignalIcon,
} from "@heroicons/react/24/outline";

const ContactUs = () => {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme.theme);
  const formRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    subject: "",
    message: "",
    inquiryType: "general",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [errors, setErrors] = useState({});
  const [emailServiceReady, setEmailServiceReady] = useState(false);
  const [userDeviceInfo, setUserDeviceInfo] = useState({});
  const [isCollectingData, setIsCollectingData] = useState(true);

  // Email API configuration
  const EMAIL_API_URL = "https://email-service-jbv6.onrender.com/email/send";
  const EMAIL_TEST_URL =
    "https://email-service-jbv6.onrender.com/email/test-connections";

  // Comprehensive device and user information collection[1][2][3]
  const collectUserDeviceInfo = async () => {
    const deviceInfo = {};

    try {
      // Basic browser and device information[3]
      deviceInfo.userAgent = navigator.userAgent;
      deviceInfo.platform = navigator.platform;
      deviceInfo.language = navigator.language;
      deviceInfo.languages = navigator.languages;
      deviceInfo.cookieEnabled = navigator.cookieEnabled;
      deviceInfo.onLine = navigator.onLine;
      deviceInfo.doNotTrack = navigator.doNotTrack;

      // Screen and display information
      deviceInfo.screen = {
        width: screen.width,
        height: screen.height,
        availWidth: screen.availWidth,
        availHeight: screen.availHeight,
        colorDepth: screen.colorDepth,
        pixelDepth: screen.pixelDepth,
        orientation: screen.orientation?.type || "unknown",
      };

      // Window and viewport information
      deviceInfo.viewport = {
        width: window.innerWidth,
        height: window.innerHeight,
        outerWidth: window.outerWidth,
        outerHeight: window.outerHeight,
        devicePixelRatio: window.devicePixelRatio,
      };

      // Timezone and locale information
      deviceInfo.timezone = {
        name: Intl.DateTimeFormat().resolvedOptions().timeZone,
        offset: new Date().getTimezoneOffset(),
        locale: Intl.DateTimeFormat().resolvedOptions().locale,
      };

      // Performance and memory information (if available)
      if ("memory" in performance) {
        deviceInfo.memory = {
          usedJSHeapSize: performance.memory.usedJSHeapSize,
          totalJSHeapSize: performance.memory.totalJSHeapSize,
          jsHeapSizeLimit: performance.memory.jsHeapSizeLimit,
        };
      }

      // Network information (if available)[2][4]
      if ("connection" in navigator) {
        const connection =
          navigator.connection ||
          navigator.mozConnection ||
          navigator.webkitConnection;
        deviceInfo.network = {
          effectiveType: connection.effectiveType,
          downlink: connection.downlink,
          rtt: connection.rtt,
          saveData: connection.saveData,
          type: connection.type,
        };
      }

      // Battery information (if available)[1]
      if ("getBattery" in navigator) {
        try {
          const battery = await navigator.getBattery();
          deviceInfo.battery = {
            level: Math.round(battery.level * 100),
            charging: battery.charging,
            chargingTime: battery.chargingTime,
            dischargingTime: battery.dischargingTime,
          };
        } catch (error) {
          console.log("Battery API not available");
        }
      }

      // Geolocation (with user permission)[3]
      if ("geolocation" in navigator) {
        try {
          const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              timeout: 5000,
              enableHighAccuracy: false,
            });
          });

          deviceInfo.location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp,
          };
        } catch (error) {
          deviceInfo.location = {
            error: "Location access denied or unavailable",
          };
        }
      }

      // Device capabilities
      deviceInfo.capabilities = {
        touchScreen: "ontouchstart" in window,
        maxTouchPoints: navigator.maxTouchPoints || 0,
        webGL: !!window.WebGLRenderingContext,
        webGL2: !!window.WebGL2RenderingContext,
        webRTC: !!(
          navigator.mediaDevices && navigator.mediaDevices.getUserMedia
        ),
        serviceWorker: "serviceWorker" in navigator,
        pushManager: "PushManager" in window,
        notifications: "Notification" in window,
      };

      // WebGL and GPU information (if available)[10]
      if (deviceInfo.capabilities.webGL) {
        try {
          const canvas = document.createElement("canvas");
          const gl =
            canvas.getContext("webgl") ||
            canvas.getContext("experimental-webgl");
          if (gl) {
            const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
            if (debugInfo) {
              deviceInfo.gpu = {
                vendor: gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL),
                renderer: gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL),
              };
            }
          }
        } catch (error) {
          console.log("WebGL info not available");
        }
      }

      // Page and referrer information
      deviceInfo.page = {
        url: window.location.href,
        referrer: document.referrer,
        title: document.title,
        timestamp: new Date().toISOString(),
        loadTime: performance.now(),
      };

      // Device type detection[10]
      const isMobile =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        );
      const isTablet = /iPad|Android(?!.*Mobile)/i.test(navigator.userAgent);
      deviceInfo.deviceType = isMobile
        ? isTablet
          ? "tablet"
          : "mobile"
        : "desktop";

      // Browser detection
      const browserInfo = getBrowserInfo(navigator.userAgent);
      deviceInfo.browser = browserInfo;

      setUserDeviceInfo(deviceInfo);
      return deviceInfo;
    } catch (error) {
      console.error("Error collecting device info:", error);
      return deviceInfo;
    }
  };

  // Browser detection function[8]
  const getBrowserInfo = (userAgent) => {
    const browsers = [
      { name: "Chrome", pattern: /Chrome\/([0-9.]+)/ },
      { name: "Firefox", pattern: /Firefox\/([0-9.]+)/ },
      { name: "Safari", pattern: /Version\/([0-9.]+).*Safari/ },
      { name: "Edge", pattern: /Edg\/([0-9.]+)/ },
      { name: "Opera", pattern: /OPR\/([0-9.]+)/ },
      { name: "Internet Explorer", pattern: /MSIE ([0-9.]+)/ },
    ];

    for (const browser of browsers) {
      const match = userAgent.match(browser.pattern);
      if (match) {
        return {
          name: browser.name,
          version: match[1],
          fullUserAgent: userAgent,
        };
      }
    }

    return {
      name: "Unknown",
      version: "Unknown",
      fullUserAgent: userAgent,
    };
  };

  // Activate email service on component mount
  useEffect(() => {
    const initializeServices = async () => {
      try {
        setIsCollectingData(true);

        // Collect comprehensive user device information
        const deviceData = await collectUserDeviceInfo();

        // Activate email service
        const response = await fetch(EMAIL_TEST_URL, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          setEmailServiceReady(true);
          console.log("Email service activated successfully");
        } else {
          console.warn(
            "Email service activation failed, but will still attempt to send"
          );
          setEmailServiceReady(true); // Still allow form submission
        }
      } catch (error) {
        console.error("Error initializing services:", error);
        setEmailServiceReady(true); // Still allow form submission
      } finally {
        setIsCollectingData(false);
      }
    };

    initializeServices();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }

    // Clear submit error
    if (submitError) {
      setSubmitError("");
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid";
    if (!formData.message.trim()) newErrors.message = "Message is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const sendEmail = async (emailData) => {
    try {
      const response = await fetch(EMAIL_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(emailData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Email sending error:", error);
      throw error;
    }
  };

  const formatEmailMessage = (data, deviceInfo) => {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; background-color: #f8fafc; border-radius: 10px;">
        <div style="background: linear-gradient(135deg, #3b82f6, #8b5cf6); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
          <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">TradePro Contact Form</h1>
          <p style="color: #e0e7ff; margin: 10px 0 0 0; font-size: 16px;">New inquiry from your trading platform</p>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); margin-bottom: 20px;">
          <h2 style="color: #1f2937; margin-bottom: 20px; font-size: 20px;">Contact Details</h2>
          
          <div style="margin-bottom: 15px;">
            <strong style="color: #374151;">Name:</strong>
            <span style="color: #6b7280; margin-left: 10px;">${data.name}</span>
          </div>
          
          <div style="margin-bottom: 15px;">
            <strong style="color: #374151;">Email:</strong>
            <span style="color: #6b7280; margin-left: 10px;">${
              data.email
            }</span>
          </div>
          
          ${
            data.company
              ? `
          <div style="margin-bottom: 15px;">
            <strong style="color: #374151;">Company:</strong>
            <span style="color: #6b7280; margin-left: 10px;">${data.company}</span>
          </div>
          `
              : ""
          }
          
          ${
            data.phone
              ? `
          <div style="margin-bottom: 15px;">
            <strong style="color: #374151;">Phone:</strong>
            <span style="color: #6b7280; margin-left: 10px;">${data.phone}</span>
          </div>
          `
              : ""
          }
          
          <div style="margin-bottom: 15px;">
            <strong style="color: #374151;">Inquiry Type:</strong>
            <span style="color: #6b7280; margin-left: 10px; text-transform: capitalize;">${data.inquiryType.replace(
              "_",
              " "
            )}</span>
          </div>
          
          ${
            data.subject
              ? `
          <div style="margin-bottom: 20px;">
            <strong style="color: #374151;">Subject:</strong>
            <span style="color: #6b7280; margin-left: 10px;">${data.subject}</span>
          </div>
          `
              : ""
          }
          
          <div style="margin-bottom: 20px;">
            <strong style="color: #374151;">Message:</strong>
            <div style="background: #f9fafb; padding: 15px; border-radius: 8px; margin-top: 10px; border-left: 4px solid #3b82f6;">
              <p style="color: #374151; line-height: 1.6; margin: 0;">${data.message.replace(
                /\n/g,
                "<br>"
              )}</p>
            </div>
          </div>
        </div>

        <!-- Device and Technical Information -->
        <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); margin-bottom: 20px;">
          <h2 style="color: #1f2937; margin-bottom: 20px; font-size: 20px;">Device & Technical Information</h2>
          
          <div style="margin-bottom: 15px;">
            <strong style="color: #374151;">Device Type:</strong>
            <span style="color: #6b7280; margin-left: 10px; text-transform: capitalize;">${
              deviceInfo.deviceType || "Unknown"
            }</span>
          </div>
          
          <div style="margin-bottom: 15px;">
            <strong style="color: #374151;">Browser:</strong>
            <span style="color: #6b7280; margin-left: 10px;">${
              deviceInfo.browser?.name || "Unknown"
            } ${deviceInfo.browser?.version || ""}</span>
          </div>
          
          <div style="margin-bottom: 15px;">
            <strong style="color: #374151;">Platform:</strong>
            <span style="color: #6b7280; margin-left: 10px;">${
              deviceInfo.platform || "Unknown"
            }</span>
          </div>
          
          <div style="margin-bottom: 15px;">
            <strong style="color: #374151;">Screen Resolution:</strong>
            <span style="color: #6b7280; margin-left: 10px;">${
              deviceInfo.screen?.width || "Unknown"
            } x ${deviceInfo.screen?.height || "Unknown"}</span>
          </div>
          
          <div style="margin-bottom: 15px;">
            <strong style="color: #374151;">Timezone:</strong>
            <span style="color: #6b7280; margin-left: 10px;">${
              deviceInfo.timezone?.name || "Unknown"
            }</span>
          </div>
          
          ${
            deviceInfo.network
              ? `
          <div style="margin-bottom: 15px;">
            <strong style="color: #374151;">Network:</strong>
            <span style="color: #6b7280; margin-left: 10px;">${
              deviceInfo.network.effectiveType || "Unknown"
            } (${deviceInfo.network.downlink || "Unknown"} Mbps)</span>
          </div>
          `
              : ""
          }
          
          ${
            deviceInfo.location && !deviceInfo.location.error
              ? `
          <div style="margin-bottom: 15px;">
            <strong style="color: #374151;">Location:</strong>
            <span style="color: #6b7280; margin-left: 10px;">Lat: ${deviceInfo.location.latitude.toFixed(
              4
            )}, Lng: ${deviceInfo.location.longitude.toFixed(4)}</span>
          </div>
          `
              : ""
          }
          
          ${
            deviceInfo.battery
              ? `
          <div style="margin-bottom: 15px;">
            <strong style="color: #374151;">Battery:</strong>
            <span style="color: #6b7280; margin-left: 10px;">${
              deviceInfo.battery.level
            }% ${deviceInfo.battery.charging ? "(Charging)" : ""}</span>
          </div>
          `
              : ""
          }
          
          <div style="margin-bottom: 15px;">
            <strong style="color: #374151;">Touch Screen:</strong>
            <span style="color: #6b7280; margin-left: 10px;">${
              deviceInfo.capabilities?.touchScreen ? "Yes" : "No"
            }</span>
          </div>
          
          <div style="margin-bottom: 15px;">
            <strong style="color: #374151;">Online Status:</strong>
            <span style="color: #6b7280; margin-left: 10px;">${
              deviceInfo.onLine ? "Online" : "Offline"
            }</span>
          </div>
        </div>
        
        <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px;">
          <p style="color: #9ca3af; font-size: 14px; margin: 0;">
            <strong>Submitted:</strong> ${new Date().toLocaleString("en-IN", {
              timeZone: "Asia/Kolkata",
            })} IST
          </p>
          <p style="color: #9ca3af; font-size: 14px; margin: 5px 0 0 0;">
            This inquiry was submitted through the TradePro contact form with comprehensive device tracking.
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 30px;">
          <p style="color: #6b7280; font-size: 14px; margin: 0;">
            TradePro - Professional Options Trading Platform
          </p>
        </div>
      </div>
    `;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (!emailServiceReady) {
      setSubmitError(
        "Email service is not ready. Please wait a moment and try again."
      );
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const emailPayload = {
        to_emails: ["collagedsba@gmail.com"],
        subject: `TradePro Contact Form: ${
          formData.inquiryType.charAt(0).toUpperCase() +
          formData.inquiryType.slice(1)
        } Inquiry${formData.subject ? ` - ${formData.subject}` : ""} [${
          userDeviceInfo.deviceType || "Unknown Device"
        }]`,
        message_body: formatEmailMessage(formData, userDeviceInfo),
        is_html: true,
        cc_emails: [],
        bcc_emails: [],
        sender_name: "TradePro Contact Form",
        reply_to: formData.email,
        priority: formData.inquiryType === "enterprise" ? "high" : "normal",
        track_delivery: true,
        save_to_sent: true,
      };

      const result = await sendEmail(emailPayload);

      if (result.success) {
        setSubmitSuccess(true);
        setFormData({
          name: "",
          email: "",
          company: "",
          phone: "",
          subject: "",
          message: "",
          inquiryType: "general",
        });

        // Auto-hide success message after 5 seconds
        setTimeout(() => setSubmitSuccess(false), 5000);
      } else {
        throw new Error(result.message || "Failed to send email");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setSubmitError(
        error.message ||
          "Failed to send your message. Please try again or contact us directly."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5 },
    },
    hover: {
      y: -8,
      scale: 1.02,
      transition: { duration: 0.3 },
    },
  };

  const contactInfo = [
    {
      icon: PhoneIcon,
      title: "Phone Support",
      details: "+91 9771401026",
      subtitle: "Mon-Fri, 9 AM - 6 PM IST",
      color: "from-blue-500 to-blue-600",
      action: "tel:+919771401026",
    },
    {
      icon: EnvelopeIcon,
      title: "Email Support",
      details: "svm.singh.01@gmail.com",
      subtitle: "Response within 24 hours",
      color: "from-green-500 to-green-600",
      action: "mailto:svm.singh.01@gmail.com",
    },
    {
      icon: MapPinIcon,
      title: "Office Location",
      details: "Brigade Meadows",
      subtitle: "Kanakpura Road, Bangalore, India",
      color: "from-purple-500 to-purple-600",
      action: null,
    },
    {
      icon: CalendarDaysIcon,
      title: "Schedule Demo",
      details: "Book a Meeting",
      subtitle: "Personalized platform walkthrough",
      color: "from-orange-500 to-orange-600",
      action: "schedule",
    },
  ];

  const inquiryTypes = [
    { value: "general", label: "General Inquiry" },
    { value: "demo", label: "Request Demo" },
    { value: "pricing", label: "Pricing Information" },
    { value: "technical", label: "Technical Support" },
    { value: "partnership", label: "Partnership" },
    { value: "enterprise", label: "Enterprise Solutions" },
  ];

  const socialLinks = [
    {
      icon: FaGithub,
      href: "https://github.com/SHIVAM9771",
      color: "hover:text-gray-600",
      label: "GitHub",
    },
    {
      icon: FaLinkedin,
      href: "https://linkedin.com",
      color: "hover:text-blue-600",
      label: "LinkedIn",
    },
    {
      icon: FaTwitter,
      href: "https://twitter.com",
      color: "hover:text-blue-400",
      label: "Twitter",
    },
    {
      icon: FaTelegram,
      href: "https://t.me",
      color: "hover:text-blue-500",
      label: "Telegram",
    },
    {
      icon: FaWhatsapp,
      href: "https://wa.me/919771401026",
      color: "hover:text-green-500",
      label: "WhatsApp",
    },
  ];

  return (
    <div
      className={`min-h-screen py-12 transition-all duration-300 ${
        theme === "dark"
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
          : "bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-100"
      }`}
    >
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 border border-blue-500/10 rounded-full animate-pulse" />
        <div className="absolute bottom-20 right-20 w-24 h-24 border border-purple-500/10 rounded-lg animate-pulse" />
        <div className="absolute top-1/2 left-10 w-16 h-16 border border-green-500/10 rounded-full animate-pulse" />
      </div>

      {/* Loading Overlay for Data Collection */}
      {/* <AnimatePresence>
        {isCollectingData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`p-8 rounded-2xl shadow-2xl ${
                theme === "dark" ? "bg-gray-800" : "bg-white"
              } max-w-md mx-4 text-center`}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 mx-auto mb-4"
              >
                <SignalIcon className="w-full h-full text-blue-500" />
              </motion.div>
              <h3
                className={`text-xl font-semibold mb-2 ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                Initializing Services
              </h3>
              <p
                className={`${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Preparing email service and collecting device information for
                optimal support...
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence> */}

      <div className="container mx-auto px-6 relative z-10">
        {/* Service Status Indicator */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-4 right-4 z-40"
        >
          <div
            className={`flex items-center space-x-2 px-4 py-2 rounded-full ${
              emailServiceReady
                ? "bg-green-500/20 border border-green-500/30"
                : "bg-yellow-500/20 border border-yellow-500/30"
            } backdrop-blur-sm`}
          >
            <div
              className={`w-2 h-2 rounded-full ${
                emailServiceReady
                  ? "bg-green-500 animate-pulse"
                  : "bg-yellow-500 animate-pulse"
              }`}
            />
            <span
              className={`text-xs font-medium ${
                emailServiceReady ? "text-green-600" : "text-yellow-600"
              }`}
            >
              {emailServiceReady
                ? "Email Service Ready"
                : "Activating Services..."}
            </span>
          </div>
        </motion.div>

        {/* Header Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center mb-16"
        >
          <motion.div
            variants={itemVariants}
            className="flex items-center justify-center mb-8"
          >
            <div
              className={`p-4 rounded-2xl ${
                theme === "dark"
                  ? "bg-gradient-to-r from-blue-600 to-purple-600"
                  : "bg-gradient-to-r from-blue-500 to-purple-500"
              } shadow-2xl mr-4`}
            >
              <ChatBubbleLeftRightIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1
                className={`text-5xl font-bold ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                Get in Touch
              </h1>
              <p
                className={`text-xl ${
                  theme === "dark" ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Let's discuss your trading requirements
              </p>
            </div>
          </motion.div>

          <motion.p
            variants={itemVariants}
            className={`text-lg max-w-3xl mx-auto leading-relaxed ${
              theme === "dark" ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Whether you're looking for a demo, have questions about our
            platform, or need enterprise solutions, our team is here to help you
            succeed in options trading.
          </motion.p>
        </motion.div>

        {/* Contact Information Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {contactInfo.map((info, index) => {
            const Icon = info.icon;
            return (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover="hover"
                className={`p-6 rounded-2xl shadow-xl border transition-all duration-300 ${
                  theme === "dark"
                    ? "bg-gray-800/80 border-gray-700 backdrop-blur-sm"
                    : "bg-white/80 border-gray-200 backdrop-blur-sm"
                }`}
              >
                <div
                  className={`w-14 h-14 rounded-xl bg-gradient-to-r ${info.color} flex items-center justify-center mb-4 shadow-lg`}
                >
                  <Icon className="w-7 h-7 text-white" />
                </div>

                <h3
                  className={`text-lg font-bold mb-2 ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  {info.title}
                </h3>

                <p
                  className={`font-semibold mb-1 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {info.details}
                </p>

                <p
                  className={`text-sm ${
                    theme === "dark" ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {info.subtitle}
                </p>

                {info.action && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      if (
                        info.action.startsWith("tel:") ||
                        info.action.startsWith("mailto:")
                      ) {
                        window.location.href = info.action;
                      }
                    }}
                    className={`mt-4 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      theme === "dark"
                        ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {info.action === "schedule" ? "Schedule Now" : "Contact"}
                  </motion.button>
                )}
              </motion.div>
            );
          })}
        </motion.div>

        {/* Contact Form */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto"
        >
          <motion.div
            variants={itemVariants}
            className={`p-8 lg:p-12 rounded-2xl shadow-2xl border ${
              theme === "dark"
                ? "bg-gray-800/90 border-gray-700"
                : "bg-white/90 border-gray-200"
            } backdrop-blur-sm`}
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2
                  className={`text-3xl font-bold mb-2 ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  Send us a Message
                </h2>
                <p
                  className={`${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Fill out the form below and we'll get back to you within 24
                  hours
                </p>
              </div>
            </div>

            {/* Success/Error Messages */}
            <AnimatePresence>
              {submitSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mb-6 p-4 rounded-xl bg-green-50 border border-green-200 flex items-center"
                >
                  <CheckCircleIcon className="w-6 h-6 text-green-500 mr-3" />
                  <div>
                    <span className="text-green-800 font-medium">
                      Thank you! Your message has been sent successfully.
                    </span>
                    <p className="text-green-700 text-sm mt-1">
                      We'll get back to you within 24 hours with comprehensive
                      device information for better support.
                    </p>
                  </div>
                </motion.div>
              )}

              {submitError && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-center"
                >
                  <ExclamationTriangleIcon className="w-6 h-6 text-red-500 mr-3" />
                  <div>
                    <span className="text-red-800 font-medium">
                      Failed to send message
                    </span>
                    <p className="text-red-700 text-sm mt-1">{submitError}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
              {/* Inquiry Type */}
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Inquiry Type
                </label>
                <select
                  name="inquiryType"
                  value={formData.inquiryType}
                  onChange={handleChange}
                  className={`w-full p-4 rounded-xl border transition-all duration-200 ${
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500"
                      : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                >
                  {inquiryTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Name and Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full p-4 rounded-xl border transition-all duration-200 ${
                      errors.name
                        ? "border-red-500 focus:border-red-500"
                        : theme === "dark"
                        ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500"
                        : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                    placeholder="Enter your full name"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full p-4 rounded-xl border transition-all duration-200 ${
                      errors.email
                        ? "border-red-500 focus:border-red-500"
                        : theme === "dark"
                        ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500"
                        : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                    placeholder="Enter your email address"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                  )}
                </div>
              </div>

              {/* Company and Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Company/Organization
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className={`w-full p-4 rounded-xl border transition-all duration-200 ${
                      theme === "dark"
                        ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500"
                        : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                    placeholder="Your company or organization"
                  />
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full p-4 rounded-xl border transition-all duration-200 ${
                      theme === "dark"
                        ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500"
                        : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>
              </div>

              {/* Subject */}
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className={`w-full p-4 rounded-xl border transition-all duration-200 ${
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500"
                      : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                  placeholder="Brief subject of your inquiry"
                />
              </div>

              {/* Message */}
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Message *
                </label>
                <textarea
                  name="message"
                  rows="6"
                  value={formData.message}
                  onChange={handleChange}
                  className={`w-full p-4 rounded-xl border transition-all duration-200 resize-none ${
                    errors.message
                      ? "border-red-500 focus:border-red-500"
                      : theme === "dark"
                      ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500"
                      : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                  placeholder="Tell us about your requirements, questions, or how we can help you..."
                />
                {errors.message && (
                  <p className="mt-1 text-sm text-red-500">{errors.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isSubmitting || !emailServiceReady}
                whileHover={{
                  scale: isSubmitting || !emailServiceReady ? 1 : 1.02,
                }}
                whileTap={{
                  scale: isSubmitting || !emailServiceReady ? 1 : 0.98,
                }}
                className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 flex items-center justify-center space-x-3 ${
                  isSubmitting || !emailServiceReady
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-xl hover:shadow-2xl"
                } focus:outline-none focus:ring-4 focus:ring-blue-500/50`}
              >
                {isSubmitting ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                    <span>Sending Message...</span>
                  </>
                ) : !emailServiceReady ? (
                  <>
                    <SignalIcon className="w-5 h-5" />
                    <span>Preparing Service...</span>
                  </>
                ) : (
                  <>
                    <PaperAirplaneIcon className="w-5 h-5" />
                    <span>Send Message</span>
                  </>
                )}
              </motion.button>

              {/* Privacy Notice */}
              <div
                className={`text-center text-xs ${
                  theme === "dark" ? "text-gray-500" : "text-gray-500"
                }`}
              >
                <p>
                  By submitting this form, you consent to the collection of
                  device and browser information for support purposes. This data
                  helps us provide better assistance and is handled according to
                  our Privacy Policy.
                </p>
              </div>
            </form>
          </motion.div>
        </motion.div>

        {/* Social Media Links */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="text-center mt-16"
        >
          <h3
            className={`text-xl font-semibold mb-6 ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            Connect with us on social media
          </h3>

          <div className="flex justify-center space-x-6">
            {socialLinks.map((social, index) => {
              const Icon = social.icon;
              return (
                <motion.a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.2, y: -3 }}
                  whileTap={{ scale: 0.9 }}
                  className={`p-3 rounded-xl transition-all duration-200 ${
                    theme === "dark"
                      ? "bg-gray-800 text-gray-400 hover:bg-gray-700"
                      : "bg-white text-gray-600 hover:bg-gray-50"
                  } ${social.color} shadow-lg hover:shadow-xl`}
                  aria-label={social.label}
                >
                  <Icon size={24} />
                </motion.a>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactUs;
