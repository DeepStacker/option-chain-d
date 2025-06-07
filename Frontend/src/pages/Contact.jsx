import React, { useState, useRef, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import {
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  ClockIcon,
  CheckCircleIcon,
  PaperAirplaneIcon,
  ChatBubbleLeftRightIcon,
  CalendarDaysIcon,
  ExclamationTriangleIcon,
  ShieldCheckIcon,
  BoltIcon,
  UserIcon,
  DevicePhoneMobileIcon,
  GlobeAltIcon,
  CpuChipIcon,
} from "@heroicons/react/24/outline";
import { FaGithub, FaLinkedin, FaTwitter, FaTelegram } from "react-icons/fa";

const ProfessionalContactUs = () => {
  const theme = useSelector((state) => state.theme.theme);
  const formRef = useRef(null);
  const serviceInitialized = useRef(false); // Prevent duplicate API calls[4][9]

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    subject: "",
    message: "",
    inquiryType: "general",
    tradingExperience: "",
    monthlyVolume: "",
    preferredContact: "email",
    urgency: "normal",
    timezone: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [errors, setErrors] = useState({});
  const [emailServiceReady, setEmailServiceReady] = useState(false);
  const [comprehensiveUserData, setComprehensiveUserData] = useState({});
  const [isCollectingData, setIsCollectingData] = useState(false);

  // Professional email service configuration
  const EMAIL_API_URL = "https://email-service-jbv6.onrender.com/email/send";
  const EMAIL_TEST_URL =
    "https://email-service-jbv6.onrender.com/email/test-connections";

  // Enhanced user data collection with privacy compliance[3]
  const collectComprehensiveUserData = useCallback(async () => {
    const userData = {
      // Basic browser information
      browser: {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
        languages: navigator.languages || [],
        cookieEnabled: navigator.cookieEnabled,
        onLine: navigator.onLine,
        doNotTrack: navigator.doNotTrack || "not specified",
        vendor: navigator.vendor || "unknown",
        product: navigator.product || "unknown",
      },

      // Screen and display information
      display: {
        screenWidth: screen.width,
        screenHeight: screen.height,
        availableWidth: screen.availWidth,
        availableHeight: screen.availHeight,
        colorDepth: screen.colorDepth,
        pixelDepth: screen.pixelDepth,
        orientation: screen.orientation?.type || "unknown",
        devicePixelRatio: window.devicePixelRatio || 1,
      },

      // Viewport information
      viewport: {
        innerWidth: window.innerWidth,
        innerHeight: window.innerHeight,
        outerWidth: window.outerWidth,
        outerHeight: window.outerHeight,
        scrollX: window.scrollX || window.pageXOffset,
        scrollY: window.scrollY || window.pageYOffset,
      },

      // Timezone and locale information
      locale: {
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        timezoneOffset: new Date().getTimezoneOffset(),
        locale: Intl.DateTimeFormat().resolvedOptions().locale,
        currency: Intl.NumberFormat().resolvedOptions().currency || "unknown",
        calendar: Intl.DateTimeFormat().resolvedOptions().calendar || "unknown",
        numberingSystem:
          Intl.DateTimeFormat().resolvedOptions().numberingSystem || "unknown",
      },

      // Performance information
      performance: {
        loadTime: performance.now(),
        navigationTiming: performance.getEntriesByType
          ? performance.getEntriesByType("navigation")[0]
          : null,
        memoryInfo: performance.memory
          ? {
              usedJSHeapSize: performance.memory.usedJSHeapSize,
              totalJSHeapSize: performance.memory.totalJSHeapSize,
              jsHeapSizeLimit: performance.memory.jsHeapSizeLimit,
            }
          : null,
      },

      // Network information[2]
      network: (() => {
        const connection =
          navigator.connection ||
          navigator.mozConnection ||
          navigator.webkitConnection;
        return connection
          ? {
              effectiveType: connection.effectiveType || "unknown",
              downlink: connection.downlink || 0,
              rtt: connection.rtt || 0,
              saveData: connection.saveData || false,
              type: connection.type || "unknown",
            }
          : { status: "not available" };
      })(),

      // Device capabilities
      capabilities: {
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
        geolocation: "geolocation" in navigator,
        localStorage: (() => {
          try {
            return typeof Storage !== "undefined";
          } catch {
            return false;
          }
        })(),
        sessionStorage: (() => {
          try {
            return typeof sessionStorage !== "undefined";
          } catch {
            return false;
          }
        })(),
        indexedDB: "indexedDB" in window,
        webWorkers: "Worker" in window,
        sharedWorkers: "SharedWorker" in window,
      },

      // Page information
      page: {
        url: window.location.href,
        hostname: window.location.hostname,
        pathname: window.location.pathname,
        search: window.location.search,
        hash: window.location.hash,
        referrer: document.referrer || "direct",
        title: document.title,
        charset: document.characterSet || document.charset,
        domain: document.domain,
        lastModified: document.lastModified,
      },

      // Session information
      session: {
        timestamp: new Date().toISOString(),
        sessionId: `session_${Date.now()}_${Math.random()
          .toString(36)
          .substr(2, 9)}`,
        visitCount: (() => {
          try {
            const count =
              parseInt(localStorage.getItem("visitCount") || "0") + 1;
            localStorage.setItem("visitCount", count.toString());
            return count;
          } catch {
            return 1;
          }
        })(),
        firstVisit: (() => {
          try {
            const firstVisit = localStorage.getItem("firstVisit");
            if (!firstVisit) {
              const now = new Date().toISOString();
              localStorage.setItem("firstVisit", now);
              return now;
            }
            return firstVisit;
          } catch {
            return new Date().toISOString();
          }
        })(),
      },

      // Device type detection[10]
      device: (() => {
        const userAgent = navigator.userAgent.toLowerCase();
        const isMobile =
          /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
            userAgent
          );
        const isTablet = /ipad|android(?!.*mobile)/i.test(userAgent);
        const isDesktop = !isMobile && !isTablet;

        return {
          type: isMobile ? (isTablet ? "tablet" : "mobile") : "desktop",
          isMobile,
          isTablet,
          isDesktop,
          os: (() => {
            if (userAgent.includes("windows")) return "Windows";
            if (userAgent.includes("mac")) return "macOS";
            if (userAgent.includes("linux")) return "Linux";
            if (userAgent.includes("android")) return "Android";
            if (
              userAgent.includes("ios") ||
              userAgent.includes("iphone") ||
              userAgent.includes("ipad")
            )
              return "iOS";
            return "Unknown";
          })(),
        };
      })(),

      // Browser detection
      browser_details: (() => {
        const userAgent = navigator.userAgent;
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
      })(),
    };

    // Optional: Collect additional data with user permission
    try {
      // Battery information (if available)[1]
      if ("getBattery" in navigator) {
        const battery = await navigator.getBattery();
        userData.battery = {
          level: Math.round(battery.level * 100),
          charging: battery.charging,
          chargingTime:
            battery.chargingTime === Infinity
              ? "unknown"
              : battery.chargingTime,
          dischargingTime:
            battery.dischargingTime === Infinity
              ? "unknown"
              : battery.dischargingTime,
        };
      }

      // WebGL information
      if (userData.capabilities.webGL) {
        const canvas = document.createElement("canvas");
        const gl =
          canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
        if (gl) {
          const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
          if (debugInfo) {
            userData.gpu = {
              vendor: gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL),
              renderer: gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL),
            };
          }
        }
      }

      // Geolocation (with explicit user permission)[3]
      if ("geolocation" in navigator && userData.capabilities.geolocation) {
        try {
          const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              timeout: 5000,
              enableHighAccuracy: false,
              maximumAge: 300000, // 5 minutes
            });
          });

          userData.location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp,
            permission: "granted",
          };
        } catch (error) {
          userData.location = {
            error: "Location access denied or unavailable",
            permission: "denied",
          };
        }
      }
    } catch (error) {
      console.log("Optional data collection failed:", error);
    }

    return userData;
  }, []);

  // Initialize services only once[4][9]
  useEffect(() => {
    if (serviceInitialized.current) return;

    const initializeServices = async () => {
      serviceInitialized.current = true;
      setIsCollectingData(true);

      try {
        // Collect comprehensive user data
        const userData = await collectComprehensiveUserData();
        setComprehensiveUserData(userData);

        // Set timezone in form data
        setFormData((prev) => ({
          ...prev,
          timezone: userData.locale.timezone,
        }));

        // Test email service
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
          setEmailServiceReady(true);
        }
      } catch (error) {
        console.error("Error initializing services:", error);
        setEmailServiceReady(true);
      } finally {
        setIsCollectingData(false);
      }
    };

    initializeServices();
  }, [collectComprehensiveUserData]);

  // Enhanced form validation[3]
  const validateForm = useCallback(() => {
    const newErrors = {};

    // Required fields validation
    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    } else if (formData.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    } else if (!/^[a-zA-Z\s]+$/.test(formData.name)) {
      newErrors.name = "Name should only contain letters and spaces";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }

    // Optional field validation
    if (formData.phone && !/^[\+]?[0-9\s\-\(\)]{10,}$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    if (formData.company && formData.company.length < 2) {
      newErrors.company = "Company name must be at least 2 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // Enhanced professional email formatting[2][7]
  const formatProfessionalEmail = useCallback((data, userData) => {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>DeepStrike Contact Inquiry</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
          .container { max-width: 800px; margin: 0 auto; background-color: #ffffff; }
          .header { background: linear-gradient(135deg, #1e40af, #3b82f6); padding: 40px 30px; text-align: center; color: white; }
          .content { padding: 40px 30px; }
          .section { margin-bottom: 30px; }
          .field { padding: 15px; background: #f9fafb; border-left: 4px solid #3b82f6; border-radius: 8px; margin-bottom: 15px; }
          .field-label { color: #374151; font-weight: bold; display: block; margin-bottom: 5px; }
          .field-value { color: #6b7280; font-size: 16px; }
          .technical-info { background: #f1f5f9; padding: 20px; border-radius: 8px; font-size: 14px; color: #64748b; }
          .footer { background: #1f2937; padding: 30px; text-align: center; color: #9ca3af; }
          .priority-high { border-left-color: #ef4444; }
          .priority-medium { border-left-color: #f59e0b; }
          .priority-low { border-left-color: #10b981; }
        </style>
      </head>
      <body>
        <div class="container">
          <!-- Header -->
          <div class="header">
            <h1 style="margin: 0; font-size: 32px; font-weight: 700;">DeepStrike Trading Platform</h1>
            <p style="margin: 10px 0 0 0; font-size: 18px; opacity: 0.9;">Professional Contact Inquiry</p>
            <div style="margin-top: 20px; padding: 10px 20px; background: rgba(255,255,255,0.1); border-radius: 20px; display: inline-block;">
              <span style="font-weight: bold;">Priority: ${data.urgency.toUpperCase()}</span>
            </div>
          </div>
          
          <!-- Main Content -->
          <div class="content">
            <!-- Contact Information -->
            <div class="section">
              <h2 style="color: #1f2937; margin-bottom: 20px; font-size: 24px; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">Contact Information</h2>
              
              <div class="field">
                <span class="field-label">Full Name:</span>
                <span class="field-value">${data.name}</span>
              </div>
              
              <div class="field">
                <span class="field-label">Email Address:</span>
                <span class="field-value">${data.email}</span>
              </div>
              
              ${
                data.company
                  ? `
              <div class="field">
                <span class="field-label">Company/Organization:</span>
                <span class="field-value">${data.company}</span>
              </div>
              `
                  : ""
              }
              
              ${
                data.phone
                  ? `
              <div class="field">
                <span class="field-label">Phone Number:</span>
                <span class="field-value">${data.phone}</span>
              </div>
              `
                  : ""
              }
              
              <div class="field">
                <span class="field-label">Preferred Contact Method:</span>
                <span class="field-value">${
                  data.preferredContact.charAt(0).toUpperCase() +
                  data.preferredContact.slice(1)
                }</span>
              </div>
              
              <div class="field">
                <span class="field-label">Timezone:</span>
                <span class="field-value">${
                  data.timezone || userData.locale?.timezone || "Not specified"
                }</span>
              </div>
            </div>
            
            <!-- Inquiry Details -->
            <div class="section">
              <h2 style="color: #1f2937; margin-bottom: 20px; font-size: 24px; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">Inquiry Details</h2>
              
              <div class="field ${
                data.urgency === "high"
                  ? "priority-high"
                  : data.urgency === "medium"
                  ? "priority-medium"
                  : "priority-low"
              }">
                <span class="field-label">Inquiry Type:</span>
                <span class="field-value">${data.inquiryType
                  .replace("_", " ")
                  .toUpperCase()}</span>
              </div>
              
              <div class="field">
                <span class="field-label">Urgency Level:</span>
                <span class="field-value">${
                  data.urgency.charAt(0).toUpperCase() + data.urgency.slice(1)
                }</span>
              </div>
              
              ${
                data.tradingExperience
                  ? `
              <div class="field">
                <span class="field-label">Trading Experience:</span>
                <span class="field-value">${data.tradingExperience}</span>
              </div>
              `
                  : ""
              }
              
              ${
                data.monthlyVolume
                  ? `
              <div class="field">
                <span class="field-label">Monthly Trading Volume:</span>
                <span class="field-value">${data.monthlyVolume}</span>
              </div>
              `
                  : ""
              }
              
              ${
                data.subject
                  ? `
              <div class="field">
                <span class="field-label">Subject:</span>
                <span class="field-value">${data.subject}</span>
              </div>
              `
                  : ""
              }
            </div>
            
            <!-- Message -->
            <div class="section">
              <h2 style="color: #1f2937; margin-bottom: 20px; font-size: 24px; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">Message</h2>
              <div style="background: #f8fafc; padding: 25px; border-radius: 12px; border: 1px solid #e5e7eb;">
                <p style="color: #374151; line-height: 1.7; margin: 0; white-space: pre-wrap;">${
                  data.message
                }</p>
              </div>
            </div>
            
            <!-- User Technical Information -->
            <div class="section">
              <h2 style="color: #1f2937; margin-bottom: 20px; font-size: 24px; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">Technical Information</h2>
              <div class="technical-info">
                <h4 style="color: #475569; margin-bottom: 15px;">Session Details</h4>
                <p><strong>Submission Time:</strong> ${
                  userData.session?.timestamp || new Date().toISOString()
                }</p>
                <p><strong>Session ID:</strong> ${
                  userData.session?.sessionId || "N/A"
                }</p>
                <p><strong>Visit Count:</strong> ${
                  userData.session?.visitCount || "N/A"
                }</p>
                <p><strong>First Visit:</strong> ${
                  userData.session?.firstVisit || "N/A"
                }</p>
                
                <h4 style="color: #475569; margin: 20px 0 15px 0;">Device & Browser</h4>
                <p><strong>Device Type:</strong> ${
                  userData.device?.type || "Unknown"
                } (${userData.device?.os || "Unknown OS"})</p>
                <p><strong>Browser:</strong> ${
                  userData.browser_details?.name || "Unknown"
                } ${userData.browser_details?.version || ""}</p>
                <p><strong>Screen Resolution:</strong> ${
                  userData.display?.screenWidth || "N/A"
                }x${userData.display?.screenHeight || "N/A"}</p>
                <p><strong>Viewport:</strong> ${
                  userData.viewport?.innerWidth || "N/A"
                }x${userData.viewport?.innerHeight || "N/A"}</p>
                
                <h4 style="color: #475569; margin: 20px 0 15px 0;">Location & Network</h4>
                <p><strong>Timezone:</strong> ${
                  userData.locale?.timezone || "N/A"
                }</p>
                <p><strong>Language:</strong> ${
                  userData.browser?.language || "N/A"
                }</p>
                <p><strong>Connection Type:</strong> ${
                  userData.network?.effectiveType || "N/A"
                }</p>
                ${
                  userData.location?.latitude
                    ? `<p><strong>Location:</strong> ${userData.location.latitude.toFixed(
                        4
                      )}, ${userData.location.longitude.toFixed(4)} (±${
                        userData.location.accuracy
                      }m)</p>`
                    : ""
                }
                
                <h4 style="color: #475569; margin: 20px 0 15px 0;">Page Information</h4>
                <p><strong>Page URL:</strong> ${userData.page?.url || "N/A"}</p>
                <p><strong>Referrer:</strong> ${
                  userData.page?.referrer || "Direct"
                }</p>
                <p><strong>Load Time:</strong> ${
                  userData.performance?.loadTime
                    ? Math.round(userData.performance.loadTime) + "ms"
                    : "N/A"
                }</p>
              </div>
            </div>
          </div>
          
          <!-- Footer -->
          <div class="footer">
            <p style="margin: 0; font-size: 14px;">
              This inquiry was submitted through the DeepStrike professional trading platform contact form.
            </p>
            <p style="margin: 10px 0 0 0; font-size: 12px;">
              DeepStrike - Professional Options Trading Platform | Bangalore, India
            </p>
            <p style="margin: 10px 0 0 0; font-size: 11px; opacity: 0.7;">
              All user data collected with consent for support purposes only.
            </p>
          </div>
        </div>
      </body>
      </html>
    `;
  }, []);

  // Handle form changes
  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));

      // Clear error when user starts typing
      if (errors[name]) {
        setErrors((prev) => ({
          ...prev,
          [name]: "",
        }));
      }

      if (submitError) {
        setSubmitError("");
      }
    },
    [errors, submitError]
  );

  // Enhanced form submission[5]
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (!validateForm()) {
        toast.error("Please fix the errors before submitting");
        return;
      }

      setIsSubmitting(true);
      setSubmitError("");

      try {
        const emailPayload = {
          to_emails: ["collagedsba@gmail.com"],
          subject: `DeepStrike ${formData.urgency.toUpperCase()} Priority: ${
            formData.inquiryType.charAt(0).toUpperCase() +
            formData.inquiryType.slice(1)
          } Inquiry${formData.subject ? ` - ${formData.subject}` : ""}`,
          message_body: formatProfessionalEmail(
            formData,
            comprehensiveUserData
          ),
          is_html: true,
          cc_emails: [],
          bcc_emails: [],
          sender_name: "DeepStrike Contact Form",
          reply_to: formData.email,
          priority:
            formData.urgency === "high"
              ? "high"
              : formData.urgency === "medium"
              ? "normal"
              : "low",
        };

        const response = await fetch(EMAIL_API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(emailPayload),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

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
            tradingExperience: "",
            monthlyVolume: "",
            preferredContact: "email",
            urgency: "normal",
            timezone: comprehensiveUserData.locale?.timezone || "",
          });

          toast.success(
            "Message sent successfully! We'll respond within 24 hours."
          );
          setTimeout(() => setSubmitSuccess(false), 5000);
        } else {
          throw new Error(result.message || "Failed to send email");
        }
      } catch (error) {
        console.error("Form submission error:", error);
        setSubmitError(
          "Failed to send your message. Please try again or contact us directly at svm.singh.01@gmail.com"
        );
        toast.error("Failed to send message. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, comprehensiveUserData, validateForm, formatProfessionalEmail]
  );

  // Enhanced form fields configuration
  const inquiryTypes = [
    { value: "general", label: "General Inquiry" },
    { value: "demo", label: "Request Demo" },
    { value: "pricing", label: "Pricing Information" },
    { value: "technical", label: "Technical Support" },
    { value: "partnership", label: "Partnership Opportunities" },
    { value: "enterprise", label: "Enterprise Solutions" },
    { value: "api", label: "API Integration" },
    { value: "bug_report", label: "Bug Report" },
    { value: "feature_request", label: "Feature Request" },
  ];

  const tradingExperienceOptions = [
    { value: "", label: "Select Experience Level" },
    { value: "beginner", label: "Beginner (< 1 year)" },
    { value: "intermediate", label: "Intermediate (1-3 years)" },
    { value: "advanced", label: "Advanced (3-5 years)" },
    { value: "professional", label: "Professional (5+ years)" },
    { value: "institutional", label: "Institutional Trader" },
  ];

  const monthlyVolumeOptions = [
    { value: "", label: "Select Monthly Volume" },
    { value: "under_1L", label: "Under ₹1 Lakh" },
    { value: "1L_5L", label: "₹1-5 Lakhs" },
    { value: "5L_25L", label: "₹5-25 Lakhs" },
    { value: "25L_1Cr", label: "₹25 Lakhs - 1 Crore" },
    { value: "above_1Cr", label: "Above ₹1 Crore" },
  ];

  const urgencyOptions = [
    { value: "low", label: "Low Priority" },
    { value: "normal", label: "Normal Priority" },
    { value: "medium", label: "Medium Priority" },
    { value: "high", label: "High Priority" },
  ];

  const preferredContactOptions = [
    { value: "email", label: "Email" },
    { value: "phone", label: "Phone Call" },
    { value: "both", label: "Both Email & Phone" },
  ];

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

  return (
    <div
      className={`min-h-screen py-12 transition-all duration-300 ${
        theme === "dark"
          ? "bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950"
          : "bg-gradient-to-br from-slate-50 via-blue-50/30 to-gray-50"
      }`}
    >
      {/* Professional Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-32 left-16 w-40 h-40 border border-blue-500/5 rounded-2xl backdrop-blur-3xl" />
        <div className="absolute bottom-32 right-16 w-32 h-32 border border-green-500/5 rounded-full backdrop-blur-3xl" />
        <div className="absolute top-1/2 right-1/4 w-24 h-24 border border-purple-500/5 rounded-xl backdrop-blur-3xl" />
      </div>

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
                : isCollectingData
                ? "bg-blue-500/20 border border-blue-500/30"
                : "bg-yellow-500/20 border border-yellow-500/30"
            } backdrop-blur-xl`}
          >
            <div
              className={`w-2 h-2 rounded-full ${
                emailServiceReady
                  ? "bg-green-500"
                  : isCollectingData
                  ? "bg-blue-500"
                  : "bg-yellow-500"
              } animate-pulse`}
            />
            <span
              className={`text-xs font-medium ${
                emailServiceReady
                  ? "text-green-600"
                  : isCollectingData
                  ? "text-blue-600"
                  : "text-yellow-600"
              }`}
            >
              {emailServiceReady
                ? "Service Ready"
                : isCollectingData
                ? "Initializing..."
                : "Connecting..."}
            </span>
          </div>
        </motion.div>

        {/* Header Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center mb-20"
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
                className={`text-5xl md:text-6xl font-black ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                Professional Support
              </h1>
              <p
                className={`text-xl ${
                  theme === "dark" ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Advanced Trading Platform Assistance
              </p>
            </div>
          </motion.div>

          <motion.p
            variants={itemVariants}
            className={`text-lg max-w-4xl mx-auto leading-relaxed ${
              theme === "dark" ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Get expert assistance from our team of trading technology
            specialists. We provide comprehensive support for platform features,
            technical issues, and enterprise solutions.
          </motion.p>
        </motion.div>

        {/* Enhanced Contact Form */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-6xl mx-auto"
        >
          <motion.div
            variants={itemVariants}
            className={`p-10 lg:p-12 rounded-3xl shadow-2xl border ${
              theme === "dark"
                ? "bg-gray-900/90 border-gray-700/50"
                : "bg-white/90 border-gray-200/50"
            } backdrop-blur-xl`}
          >
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2
                  className={`text-4xl font-black mb-3 ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  Contact Form
                </h2>
                <p
                  className={`text-lg ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Professional support with comprehensive tracking
                </p>
              </div>

              {/* Data Collection Status */}
              {/* <div
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl ${
                  theme === "dark" ? "bg-gray-800/50" : "bg-gray-100/50"
                }`}
              >
                <CpuChipIcon className="w-5 h-5 text-blue-500" />
                <span
                  className={`text-sm ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Enhanced Tracking Active
                </span>
              </div> */}
            </div>

            {/* Success/Error Messages */}
            <AnimatePresence>
              {submitSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mb-8 p-6 rounded-2xl bg-green-50 border border-green-200 flex items-center"
                >
                  <CheckCircleIcon className="w-8 h-8 text-green-500 mr-4" />
                  <div>
                    <span className="text-green-800 font-semibold text-lg">
                      Message sent successfully!
                    </span>
                    <p className="text-green-700 text-sm mt-1">
                      Our team will respond within 24 hours with detailed
                      assistance.
                    </p>
                  </div>
                </motion.div>
              )}

              {submitError && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mb-8 p-6 rounded-2xl bg-red-50 border border-red-200 flex items-center"
                >
                  <ExclamationTriangleIcon className="w-8 h-8 text-red-500 mr-4" />
                  <div>
                    <span className="text-red-800 font-semibold text-lg">
                      Failed to send message
                    </span>
                    <p className="text-red-700 text-sm mt-1">{submitError}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <form ref={formRef} onSubmit={handleSubmit} className="space-y-8">
              {/* Inquiry Type and Urgency */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    className={`block text-sm font-semibold mb-3 ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Inquiry Type *
                  </label>
                  <select
                    name="inquiryType"
                    value={formData.inquiryType}
                    onChange={handleChange}
                    className={`w-full p-4 rounded-xl border transition-all duration-200 ${
                      theme === "dark"
                        ? "bg-gray-800 border-gray-600 text-white focus:border-blue-500"
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

                <div>
                  <label
                    className={`block text-sm font-semibold mb-3 ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Priority Level *
                  </label>
                  <select
                    name="urgency"
                    value={formData.urgency}
                    onChange={handleChange}
                    className={`w-full p-4 rounded-xl border transition-all duration-200 ${
                      theme === "dark"
                        ? "bg-gray-800 border-gray-600 text-white focus:border-blue-500"
                        : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                  >
                    {urgencyOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Name and Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    className={`block text-sm font-semibold mb-3 ${
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
                        ? "bg-gray-800 border-gray-600 text-white focus:border-blue-500"
                        : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                    placeholder="Enter your full name"
                  />
                  {errors.name && (
                    <p className="mt-2 text-sm text-red-500">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label
                    className={`block text-sm font-semibold mb-3 ${
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
                        ? "bg-gray-800 border-gray-600 text-white focus:border-blue-500"
                        : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                    placeholder="Enter your email address"
                  />
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-500">{errors.email}</p>
                  )}
                </div>
              </div>

              {/* Company and Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    className={`block text-sm font-semibold mb-3 ${
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
                      errors.company
                        ? "border-red-500 focus:border-red-500"
                        : theme === "dark"
                        ? "bg-gray-800 border-gray-600 text-white focus:border-blue-500"
                        : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                    placeholder="Your company or organization"
                  />
                  {errors.company && (
                    <p className="mt-2 text-sm text-red-500">
                      {errors.company}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    className={`block text-sm font-semibold mb-3 ${
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
                      errors.phone
                        ? "border-red-500 focus:border-red-500"
                        : theme === "dark"
                        ? "bg-gray-800 border-gray-600 text-white focus:border-blue-500"
                        : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                    placeholder="+91 XXXXX XXXXX"
                  />
                  {errors.phone && (
                    <p className="mt-2 text-sm text-red-500">{errors.phone}</p>
                  )}
                </div>
              </div>

              {/* Trading Experience and Volume */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    className={`block text-sm font-semibold mb-3 ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Trading Experience
                  </label>
                  <select
                    name="tradingExperience"
                    value={formData.tradingExperience}
                    onChange={handleChange}
                    className={`w-full p-4 rounded-xl border transition-all duration-200 ${
                      theme === "dark"
                        ? "bg-gray-800 border-gray-600 text-white focus:border-blue-500"
                        : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                  >
                    {tradingExperienceOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    className={`block text-sm font-semibold mb-3 ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Monthly Trading Volume
                  </label>
                  <select
                    name="monthlyVolume"
                    value={formData.monthlyVolume}
                    onChange={handleChange}
                    className={`w-full p-4 rounded-xl border transition-all duration-200 ${
                      theme === "dark"
                        ? "bg-gray-800 border-gray-600 text-white focus:border-blue-500"
                        : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                  >
                    {monthlyVolumeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Preferred Contact and Subject */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    className={`block text-sm font-semibold mb-3 ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Preferred Contact Method
                  </label>
                  <select
                    name="preferredContact"
                    value={formData.preferredContact}
                    onChange={handleChange}
                    className={`w-full p-4 rounded-xl border transition-all duration-200 ${
                      theme === "dark"
                        ? "bg-gray-800 border-gray-600 text-white focus:border-blue-500"
                        : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                  >
                    {preferredContactOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    className={`block text-sm font-semibold mb-3 ${
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
                        ? "bg-gray-800 border-gray-600 text-white focus:border-blue-500"
                        : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                    placeholder="Brief subject of your inquiry"
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <label
                  className={`block text-sm font-semibold mb-3 ${
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
                      ? "bg-gray-800 border-gray-600 text-white focus:border-blue-500"
                      : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                  placeholder="Describe your inquiry, technical issue, or requirements in detail..."
                />
                {errors.message && (
                  <p className="mt-2 text-sm text-red-500">{errors.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isSubmitting || !emailServiceReady}
                whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                className={`w-full py-5 px-8 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center justify-center space-x-3 ${
                  isSubmitting || !emailServiceReady
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-2xl hover:shadow-3xl"
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
                      className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                    />
                    <span>Sending Message...</span>
                  </>
                ) : !emailServiceReady ? (
                  <>
                    <GlobeAltIcon className="w-6 h-6" />
                    <span>Connecting to Service...</span>
                  </>
                ) : (
                  <>
                    <PaperAirplaneIcon className="w-6 h-6" />
                    <span>Send Professional Message</span>
                  </>
                )}
              </motion.button>

              {/* Enhanced Privacy Notice */}
              <div
                className={`text-center text-sm space-y-3 ${
                  theme === "dark" ? "text-gray-500" : "text-gray-500"
                }`}
              >
                <div
                  className={`p-4 rounded-xl border ${
                    theme === "dark"
                      ? "bg-blue-900/20 border-blue-500/30"
                      : "bg-blue-50 border-blue-200"
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <ShieldCheckIcon className="w-5 h-5 text-blue-500" />
                    <span className="font-semibold">
                      Privacy & Data Collection
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed">
                    By submitting this form, you consent to the collection of
                    comprehensive technical information for support and
                    analytics purposes. This includes device details, browser
                    information, location data (if permitted), and session
                    tracking to help us provide better assistance and improve
                    our services.
                  </p>
                </div>
                <p className="text-xs">
                  All data is handled according to our Privacy Policy and used
                  solely for support purposes. We implement enterprise-grade
                  security measures to protect your information.
                </p>
              </div>
            </form>
          </motion.div>
        </motion.div>

        {/* Professional Social Media Links */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="text-center mt-20"
        >
          <h3
            className={`text-2xl font-bold mb-8 ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            Connect with Our Development Team
          </h3>

          <div className="flex justify-center space-x-6">
            {[
              {
                icon: FaGithub,
                href: "https://github.com/SHIVAM9771",
                color: "hover:text-gray-600",
                label: "GitHub",
              },
              {
                icon: FaLinkedin,
                href: "https://linkedin.com/in/shivam-kumar",
                color: "hover:text-blue-600",
                label: "LinkedIn",
              },
              {
                icon: FaTwitter,
                href: "https://twitter.com/deepstrike",
                color: "hover:text-blue-400",
                label: "Twitter",
              },
              {
                icon: FaTelegram,
                href: "https://t.me/deepstrike",
                color: "hover:text-blue-500",
                label: "Telegram",
              },
            ].map((social, index) => {
              const Icon = social.icon;
              return (
                <motion.a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.2, y: -5 }}
                  whileTap={{ scale: 0.9 }}
                  className={`p-4 rounded-2xl transition-all duration-300 ${
                    theme === "dark"
                      ? "bg-gray-800/80 text-gray-400 hover:bg-gray-700"
                      : "bg-white/80 text-gray-600 hover:bg-gray-50"
                  } ${
                    social.color
                  } shadow-xl hover:shadow-2xl backdrop-blur-xl border ${
                    theme === "dark"
                      ? "border-gray-700/50"
                      : "border-gray-200/50"
                  }`}
                  aria-label={social.label}
                >
                  <Icon size={28} />
                </motion.a>
              );
            })}
          </div>
        </motion.div>

        {/* Risk Disclosure */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="mt-16 max-w-4xl mx-auto"
        >
          <div
            className={`flex items-start space-x-4 p-6 rounded-2xl border ${
              theme === "dark"
                ? "bg-amber-900/20 border-amber-500/30 text-amber-200"
                : "bg-amber-50 border-amber-200 text-amber-800"
            } backdrop-blur-xl`}
          >
            <ExclamationTriangleIcon className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm leading-relaxed">
                <span className="font-semibold">Disclaimer:</span> DeepStrike is
                a professional trading platform provider. Trading in derivatives
                involves substantial risk of loss. This contact form collects
                comprehensive user data for support optimization and service
                improvement purposes.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfessionalContactUs;
