import { useState, useEffect, useRef } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { allServices } from "./servicesData";
import { Link } from "react-router-dom";

const ServiceDetails = () => {
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const { title } = useParams(); // Extract the service title from the route params
  const location = useLocation(); // Access location state
  const navigate = useNavigate();

  const [showError, setShowError] = useState(false);

  // Provider search states
  const [providerSuggestions, setProviderSuggestions] = useState([]);
  const [providerInput, setProviderInput] = useState("");
  const [selectedProvider, setSelectedProvider] = useState(null);

  // Normalize the title param to lower case for case-insensitive matching
  const decodedTitle = decodeURIComponent(title || "").toLowerCase();
  const service = allServices.find(
    (service) => service.title.toLowerCase() === decodedTitle
  );
  // Get the passed zip code from location state
  const passedZipCode = location.state?.zipCode || "";

  if (!service) {
    return (
      <div className="container mx-auto px-6 py-12 pt-24 text-center">
        <h1 className="text-3xl text-red-500">Service Not Found</h1>
        <p className="text-gray-600">
          Please check the URL or select a valid service.
        </p>
      </div>
    );
  }

  // Initialize form data state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    streetAddress: "",
    city: "",
    state: "",
    zipCode: passedZipCode,
    ...(service?.inputs?.reduce((acc, input) => {
      acc[input.question] = ""; // Add service-specific questions to formData
      return acc;
    }, {}) || {}),
    HomeOwner: "",
    PropertyType: "",
    PurchaseTimeFrame: "",
    BestTimeToCall: "",
    "Brief data about requirements": "",
    agreement: false,
    affid: "",
    rid: "",
    tid: "",
    url: "",
    start: "",
    min: "",
    ipAddress: "",
    userAgent: "",
    electricalEnergyProviderId: "",
    electricalEnergyProvider: "",
    universalLeadid: "",
    xxTrustedFormCertUrl: "",
  });

  // Update formData.url when the location changes
  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      url: window.location.href, // Update with the current URL
    }));
  }, [location.pathname]); // Re-run whenever the path changes

  // Fetch and set initial parameters on component mount
  useEffect(() => {
    fetch("https://api.ipify.org?format=json")
      .then((response) => response.json())
      .then((data) => {
        setFormData((prevData) => ({
          ...prevData,
          ipAddress: data.ip,
        }));
      });

    setFormData((prevData) => ({
      ...prevData,
      userAgent: navigator.userAgent,
    }));

    const urlParams = new URLSearchParams(window.location.search);
    const affid = urlParams.get("affid") || "";
    const rid = urlParams.get("rid") || "";
    const tid = urlParams.get("tid") || "";

    setFormData((prevData) => ({
      ...prevData,
      affid,
      rid,
      tid,
      url: window.location.href,
    }));

    const start = new Date().getTime();
    const min = Math.floor(start / 60000);
    setFormData((prevData) => ({
      ...prevData,
      start,
      min,
    }));
  }, []);


  // Add TrustedForm script dynamically - only on service pages
  useEffect(() => {
    if (!location.pathname.startsWith('/services/')) return;

    // Clear existing TrustedForm input
    const existingTFInput = document.querySelector('input[name="xxTrustedFormCertUrl"]');
    if (existingTFInput) {
      existingTFInput.value = '';
    }

    const trustedFormSrc =
      (document.location.protocol === "https:" ? "https" : "http") +
      "://api.trustedform.com/trustedform.js?field=xxTrustedFormCertUrl&ping_field=xxTrustedFormPingUrl&l=" +
      new Date().getTime() +
      Math.random();

    // Remove existing script if any
    const existingTrustedForm = document.querySelector(`script[src*="${trustedFormSrc.split('?')[0]}"]`);
    if (existingTrustedForm) {
      document.body.removeChild(existingTrustedForm);
    }

    const trustedFormScript = document.createElement("script");
    trustedFormScript.type = "text/javascript";
    trustedFormScript.async = true;
    trustedFormScript.src = trustedFormSrc;

    document.body.appendChild(trustedFormScript);

    return () => {
      if (document.body.contains(trustedFormScript)) {
        document.body.removeChild(trustedFormScript);
      }
    };
  }, [location.pathname]); // Reload on URL path change

  // Add LeadiD script dynamically - only on service pages
  useEffect(() => {
    if (!location.pathname.startsWith('/services/')) return;

    // Clear existing leadid_token value
    const existingLeadiDInput = document.getElementById('leadid_token');
    if (existingLeadiDInput) {
      existingLeadiDInput.value = '';
    }

    const leadiDScriptSrc =
      "//create.lidstatic.com/campaign/548c86c2-3c24-2ec2-b201-274ffb0f5005.js?snippet_version=2";

    // Remove existing script if any
    const existingLeadiD = document.querySelector(`script[src="${leadiDScriptSrc}"]`);
    if (existingLeadiD) {
      document.body.removeChild(existingLeadiD);
    }

    const leadiDScript = document.createElement("script");
    leadiDScript.id = "LeadiDscript_campaign";
    leadiDScript.type = "text/javascript";
    leadiDScript.async = true;
    leadiDScript.src = leadiDScriptSrc;

    document.body.appendChild(leadiDScript);

    // Poll every 2 seconds for leadid_token until it has a value
    const pollInterval = setInterval(() => {
      const leadiDInput = document.getElementById('leadid_token');
      if (leadiDInput && leadiDInput.value) {
        setFormData((prevData) => ({
          ...prevData,
          universalLeadid: leadiDInput.value,
        }));
        clearInterval(pollInterval);
      }
    }, 2000);

    return () => {
      if (document.body.contains(leadiDScript)) {
        document.body.removeChild(leadiDScript);
      }
      clearInterval(pollInterval);
    };
  }, [location.pathname]); // Reload on URL path change

  // Store affiliate params only on first load
  const affiliateParamsRef = useRef(null);

  useEffect(() => {
    // Always run to refresh params on each visit
    const urlParams = new URLSearchParams(window.location.search);
    const paramsToStore = {};
    // Store all query params
    for (const [key, value] of urlParams.entries()) {
      paramsToStore[key] = value;
    }
    affiliateParamsRef.current = paramsToStore;

    // Remove query params from URL (clean URL)
    if (window.history.replaceState) {
      const cleanUrl =
        window.location.origin +
        window.location.pathname +
        window.location.hash;
      window.history.replaceState({}, document.title, cleanUrl);
    }

    // Set them in formData
    setFormData((prevData) => ({
      ...prevData,
      ...paramsToStore,
      url: window.location.origin + window.location.pathname, // Clean URL
    }));
  }, []);

  const fetchProviders = async (query) => {
    if (query.length < 2) {
      setProviderSuggestions([]);
      return;
    }
    try {
      const response = await fetch(`https://steermarketeer.com/API/providers.php?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      // Sort by matching: put exact matches first
      const sorted = data.sort((a, b) => {
        const aIndex = a.name.toLowerCase().indexOf(query.toLowerCase());
        const bIndex = b.name.toLowerCase().indexOf(query.toLowerCase());
        if (aIndex === -1 && bIndex === -1) return 0;
        if (aIndex === -1) return 1;
        if (bIndex === -1) return -1;
        return aIndex - bIndex;
      });
      setProviderSuggestions(sorted);
    } catch (error) {
      console.error('Error fetching providers:', error);
      setProviderSuggestions([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.agreement) {
      setShowError(true);
      return;
    }
    setShowError(false);

    // --- Custom Mapping as per user instructions ---
    let formDataObj = { ...formData };

    // Merge affiliate params (from ref) into API payload
    if (affiliateParamsRef.current) {
      formDataObj = { ...affiliateParamsRef.current, ...formDataObj };
    }

    // Ensure both aff_click_id and transaction_id are set to tid if available
    if (formDataObj.tid) {
      formDataObj.aff_click_id = formDataObj.tid;
      formDataObj.transaction_id = formDataObj.tid;
    }

    // Get TrustedForm certificate value if present
    const tfInput = document.querySelector('input[name="xxTrustedFormCertUrl"]');
    if (tfInput && tfInput.value) {
      formDataObj.xxTrustedFormCertUrl = tfInput.value;
    } else {
      formDataObj.xxTrustedFormCertUrl = formData.xxTrustedFormCertUrl || '';
    }

    // Get LeadiD token value and send as universalLeadid
    const leadiDInput = document.getElementById('leadid_token');
    if (leadiDInput && leadiDInput.value) {
      formDataObj.universalLeadid = leadiDInput.value;
    } else {
      formDataObj.universalLeadid = formData.universalLeadid || '';
    }

    // Dynamic mapping for service-specific questions
    let mappedData = {};
    if (service && service.inputs) {
      service.inputs.forEach((input) => {
        const question = input.question;
        const answer = formData[question];
        if (answer !== undefined && answer !== "") {
          // Movers-specific mapping handled below
          if (service.title === "Movers") return;
          // Main mapping logic for all other services
          if (question === "Homeowner") {
            mappedData["HomeOwner"] = answer === "Yes" ? 1 : 2;
          } else if (question === "Property type") {
            mappedData["PropertyType"] =
              answer === "Single Family" ? 1 : answer === "Townhouse" ? 2 : answer === "Condo" ? 3 : answer === "Multi Family" ? 4 : 5;
          } else if (question === "Purchase timeframe") {
            mappedData["PurchaseTimeFrame"] =
              answer === "Immediately" ? 1 : answer === "1-3 Months" ? 2 : answer === "3-6 Months" ? 3 : answer === "6+ Months" ? 4 : 5;
          } else if (question === "Best time to call") {
            mappedData["BestTimeToCall"] =
              answer === "Morning" ? 1 : answer === "Afternoon" ? 2 : answer === "Evening" ? 3 : 4;
          } else if (question === "What type of project") {
            // Map to Sidingtype as 1-12 based on option index+1
            const opts = input.options || [];
            const idx = opts.indexOf(answer);
            mappedData["Sidingtype"] = idx >= 0 ? idx + 1 : answer;
          } else if (question === "Type of remodeling needed") {
            // Map to bathtype as 1-11 based on option index+1
            const opts = input.options || [];
            const idx = opts.indexOf(answer);
            mappedData["bathtype"] = idx >= 0 ? idx + 1 : answer;
          } else if (question === "Type of fencing project?") {
            // Map to Fencingtype as 1-14 based on option index+1
            const opts = input.options || [];
            const idx = opts.indexOf(answer);
            mappedData["Fencingtype"] = idx >= 0 ? idx + 1 : answer;
          } else if (question === "Floor Type?") {
            // Map to Floortype as 1-11 based on option index+1
            const opts = input.options || [];
            const idx = opts.indexOf(answer);
            mappedData["Floortype"] = idx >= 0 ? idx + 1 : answer;
          } else if (question === "Type of painting needed") {
            // Map to PaintType as 1-10 based on option index+1
            const opts = input.options || [];
            const idx = opts.indexOf(answer);
            mappedData["PaintType"] = idx >= 0 ? idx + 1 : answer;
          } else if (question === "Type of plumbing needed?") {
            // Map to PlumberType as 1-11 based on option index+1
            const opts = input.options || [];
            const idx = opts.indexOf(answer);
            mappedData["PlumberType"] = idx >= 0 ? idx + 1 : answer;
          } else if (question === "Type of product needed") {
            // Map to Guttertype as 1-4 based on option index+1
            const opts = input.options || [];
            const idx = opts.indexOf(answer);
            mappedData["Guttertype"] = idx >= 0 ? idx + 1 : answer;
          } else if (question === "Type of service needed") {
            // Map to HomeSecurity as 1-3 based on option index+1
            const opts = input.options || [];
            const idx = opts.indexOf(answer);
            mappedData["HomeSecurity"] = idx >= 0 ? idx + 1 : answer;
          } else if (question === "Type of remodeling needed?") {
            // Map to Kitchentype as 1-7 based on option index+1
            const opts = input.options || [];
            const idx = opts.indexOf(answer);
            mappedData["Kitchentype"] = idx >= 0 ? idx + 1 : answer;
          } else if (question === "What is the material of your windows") {
            // Map to windowsMaterial as 1-6 based on option index+1
            const opts = input.options || [];
            const idx = opts.indexOf(answer);
            mappedData["windowsMaterial"] = idx >= 0 ? idx + 1 : answer;
          } else if (question === "What type of material do you need") {
            // Map to roofingType as 1-6 based on option index+1
            const opts = input.options || [];
            const idx = opts.indexOf(answer);
            mappedData["roofingType"] = idx >= 0 ? idx + 1 : answer;
          } else if (question === "What type of HVAC do you need") {
            // Map to HVACType as 1-22 based on option index+1
            const opts = input.options || [];
            const idx = opts.indexOf(answer);
            mappedData["HVACType"] = idx >= 0 ? idx + 1 : answer;
          } else if (question === "How much sun hits your roof?") {
            // Map to HowMuchSun as 1-4 based on option index+1
            const opts = input.options || [];
            const idx = opts.indexOf(answer);
            mappedData["HowMuchSun"] = idx >= 0 ? idx + 1 : answer;
          } else if (question === "How many windows are involved?") {
            // Map to windowsType as 1-5 based on option index+1
            const opts = input.options || [];
            const idx = opts.indexOf(answer);
            mappedData["windowsType"] = idx >= 0 ? idx + 1 : answer;
          } else if (question === "How much is your currency bill?") {
            // Map to SolarCurrencyBill as 1-11 based on option index+1
            const opts = input.options || [];
            const idx = opts.indexOf(answer);
            mappedData["SolarCurrencyBill"] = idx >= 0 ? idx + 1 : answer;
          } else if (question === "What is the nature of your project?") {
            // Map to ProjectNature with coding based on number of options
            const opts = input.options || [];
            if (opts.length === 3) {
              if (answer === opts[0]) mappedData["ProjectNature"] = 1;
              else if (answer === opts[1]) mappedData["ProjectNature"] = 2;
              else if (answer === opts[2]) mappedData["ProjectNature"] = 3;
              else mappedData["ProjectNature"] = answer;
            } else if (opts.length === 2) {
              if (answer === opts[0]) mappedData["ProjectNature"] = 1;
              else if (answer === opts[1]) mappedData["ProjectNature"] = 3;
              else mappedData["ProjectNature"] = answer;
            } else {
              mappedData["ProjectNature"] = answer;
            }
          } else if (question === "Who is your energy provider?") {
            mappedData["ElectricalEnergyProviderId"] = formData.electricalEnergyProviderId;
            mappedData["ElectricalEnergyProvider"] = formData.electricalEnergyProvider;
          } else if (question === "Project status?") {
            mappedData["ProjectStatus"] = answer === "Ready to hire" ? 1 : 2;
          } else {
            mappedData[question] = answer;
          }
        }
      });
    }

    // Merge mappedData into formDataObj
    formDataObj = { ...formDataObj, ...mappedData };

    // Rename and map fields as per requirements
    if (formDataObj.streetAddress) {
      formDataObj.address = formDataObj.streetAddress;
      delete formDataObj.streetAddress;
    }
    if (formDataObj.zipCode) {
      formDataObj.zip = formDataObj.zipCode;
      delete formDataObj.zipCode;
    }
    if (formDataObj.HomeOwner) {
      if (formDataObj.HomeOwner === "1" || formDataObj.HomeOwner === 1 || formDataObj.HomeOwner === "Yes") {
        formDataObj.homeOwner = 1;
      } else if (formDataObj.HomeOwner === "2" || formDataObj.HomeOwner === 2 || formDataObj.HomeOwner === "No") {
        formDataObj.homeOwner = 2;
      } else {
        formDataObj.homeOwner = "";
      }
      delete formDataObj.HomeOwner;
    }
    if (formDataObj.PropertyType) {
      const propertyTypeOptions = ["Commercial", "Multi-Unit", "Residential"];
      const selectedPropertyType = formDataObj.PropertyType;
      const propertyTypeCode = propertyTypeOptions.indexOf(selectedPropertyType) + 1;
      formDataObj.Propertytype = propertyTypeCode > 0 ? propertyTypeCode : "";
      delete formDataObj.PropertyType;
    }
    if (formDataObj.PurchaseTimeFrame) {
      const purchaseTimeFrameOptions = [
        "1-2 weeks",
        "3-4 weeks",
        "5-6 weeks",
        "7-8 weeks",
        "Time Is Flexible"
      ];
      const selectedPurchaseTimeFrame = formDataObj.PurchaseTimeFrame;
      const purchaseTimeFrameCode = purchaseTimeFrameOptions.indexOf(selectedPurchaseTimeFrame) + 1;
      formDataObj.Purchasetimeframe = purchaseTimeFrameCode > 0 ? purchaseTimeFrameCode : "";
      delete formDataObj.PurchaseTimeFrame;
    }
    if (formDataObj.BestTimeToCall) {
      const bestTimeToCallOptions = ["Anytime", "Morning", "Afternoon", "Evening"];
      const selectedBestTimeToCall = formDataObj.BestTimeToCall;
      const bestTimeToCallCode = bestTimeToCallOptions.indexOf(selectedBestTimeToCall) + 1;
      formDataObj.Timetocall = bestTimeToCallCode > 0 ? bestTimeToCallCode : "";
      delete formDataObj.BestTimeToCall;
    }
    if (formDataObj["Brief data about requirements"]) {
      formDataObj.BriefRequirement = formDataObj["Brief data about requirements"];
      delete formDataObj["Brief data about requirements"];
    }
    if (formDataObj.ipAddress) {
      formDataObj.ipaddress = formDataObj.ipAddress;
      delete formDataObj.ipAddress;
    }
    if (formDataObj.userAgent) {
      formDataObj.browser = formDataObj.userAgent;
      delete formDataObj.userAgent;
    }

    // Movers: rename fields for API (no coding needed)
    if (service.title === "Movers") {
      if (formDataObj["When are you planning to move"]) {
        formDataObj.MovingDate = formDataObj["When are you planning to move"];
        delete formDataObj["When are you planning to move"];
      }
      if (formDataObj["Move size"]) {
        const moveSizeOptions = [
          "Studio",
          "1 Bedroom",
          "2 Bedrooms",
          "3 Bedrooms",
          "4 Bedrooms",
          "Over 4 Bedrooms",
          "Partial Home"
        ];
        const selectedMoveSize = formDataObj["Move size"];
        const moveSizeCode = moveSizeOptions.indexOf(selectedMoveSize) + 1;
        formDataObj.Movesize = moveSizeCode > 0 ? moveSizeCode : "";
        delete formDataObj["Move size"];
      }
      if (formDataObj["Current zip code"]) {
        formDataObj.Moverszip = formDataObj["Current zip code"];
        delete formDataObj["Current zip code"];
      }
      if (formDataObj["Moving zip code"]) {
        formDataObj.Moverszip2 = formDataObj["Moving zip code"];
        delete formDataObj["Moving zip code"];
      }
      if (formDataObj["Moving Distance"]) {
        const movingDistanceOptions = ["Long Distance", "Locoal ", "Other"];
        const selectedMovingDistance = formDataObj["Moving Distance"];
        const movingDistanceCode = movingDistanceOptions.indexOf(selectedMovingDistance) + 1;
        formDataObj.movingDistance = movingDistanceCode > 0 ? movingDistanceCode : "";
        delete formDataObj["Moving Distance"];
      }
    }

    // Add final API payload fields
    formDataObj = {
      ...formDataObj,
      category: service.category,
      TcpaText: "By providing my phone number, I consent to receive marketing calls and/or text messages, including from automated systems, at the phone number provided, from The Contractor Now and its affiliates. I understand that consent is not required for purchase. I also understand that message and data rates may apply. I can revoke my consent at any time by replying \"STOP\" to any text message or contacting PingTree Systems directly. For more information, please refer to PTS's Privacy Policy."
    };

    // Replace state with abbreviation
    if (formDataObj.state) {
      formDataObj.state = stateAbbreviations[formDataObj.state] || "";
    }

    setLoading(true);
    setApiError("");
    try {
      const response = await fetch("https://thecontractornow.com/api/ping-proxy.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formDataObj),
      });
      setLoading(false);
      if (response.status === 200) {
        // Clear localStorage and sessionStorage
        localStorage.clear();
        sessionStorage.clear();

        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          streetAddress: "",
          city: "",
          state: "",
          zipCode: "",
          ...(service?.inputs?.reduce((acc, input) => {
            acc[input.question] = "";
            return acc;
          }, {}) || {}),
          HomeOwner: "",
          PropertyType: "",
          PurchaseTimeFrame: "",
          BestTimeToCall: "",
          "Brief data about requirements": "",
          agreement: false,
          affid: "",
          rid: "",
          tid: "",
          url: "",
          start: "",
          min: "",
          ipAddress: "",
          userAgent: "",
          electricalEnergyProviderId: "",
          electricalEnergyProvider: "",
          universalLeadid: "",
          xxTrustedFormCertUrl: "",
        });
        setProviderInput("");
        setSelectedProvider(null);
        setProviderSuggestions([]);
        navigate("/thankYou");
        return;
      }
      setApiError("There was a problem submitting your request. Please press Submit again.");
    } catch {
      setLoading(false);
      setApiError("There was a problem submitting your request. Please press Submit again.");
    }
  };

  const [isUS, setIsUS] = useState(true);
  const [ipChecked, setIpChecked] = useState(false);
  const [zipError, setZipError] = useState("");
  const [phoneError, setPhoneError] = useState(""); // Add this state
  const [emailError, setEmailError] = useState(""); // Add this state

  // IP validation effect
  useEffect(() => {
    if (formData.ipAddress) {
      fetch(`https://ipapi.co/${formData.ipAddress}/json/`)
        .then((res) => res.json())
        .then((data) => {
          setIsUS(data.country_code === "US");
          setIpChecked(true);
        })
        .catch(() => {
          setIsUS(true); // fallback: allow
          setIpChecked(true);
        });
    }
  }, [formData.ipAddress]);

  // Zip validation effect
  useEffect(() => {
    setZipError("");
    if (formData.zipCode.length === 5 && formData.state) {
      fetch(`https://steermarketeer.com/api/a9f3b2c1e7d4?zip=${formData.zipCode}`, {
        method: "POST"
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.state_name === "Unknown") {
            setZipError("Invalid zip code: not a US zip.");
          } else if (data.state_name !== formData.state) {
            setZipError("Zip code does not match selected state.");
          } else {
            setZipError("");
          }
        })
        .catch(() => setZipError("Could not validate zip code."));
    }
  }, [formData.zipCode, formData.state]);

  // Phone validation effect
  useEffect(() => {
    if (formData.phone.length === 10) {
      const areaCode = parseInt(formData.phone.substring(0, 3), 10);
      if (!areaCodesUS.includes(areaCode)) {
        setPhoneError("Phone number area code is not valid for US.");
      } else {
        setPhoneError("");
      }
    } else if (formData.phone.length > 0 && formData.phone.length < 10) {
      setPhoneError("Phone number must be exactly 10 digits.");
    } else {
      setPhoneError("");
    }
  }, [formData.phone]);

  // Email validation effect
  useEffect(() => {
    const validateEmailFormat = (email) => {
      // Basic format check
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    if (formData.email) {
      if (!validateEmailFormat(formData.email)) {
        setEmailError("Invalid email format.");
        return;
      }
      // Extract domain after @
      const domain = formData.email.split("@")[1];
      if (domain) {
        fetch(`https://8.8.8.8/resolve?name=${domain}&type=MX`)
          .then((res) => res.json())
          .then((data) => {
            if (data.Status === 3) {
              setEmailError("Invalid email address.");
            } else {
              setEmailError("");
            }
          })
          .catch(() => setEmailError("Could not verify email address."));
      }
    } else {
      setEmailError("");
    }
  }, [formData.email]);

  // Auto-fill city after zip/state match
  useEffect(() => {
    // Only run if zip is valid and matches selected state
    if (
      formData.zipCode.length === 5 &&
      formData.state &&
      !zipError // zipError is empty, so zip/state match
    ) {
      fetch(`https://api.zippopotam.us/us/${formData.zipCode}`)
        .then((res) => {
          if (!res.ok) throw new Error("Invalid zip");
          return res.json();
        })
        .then((data) => {
          if (data.places && data.places.length > 0) {
            setFormData((prev) => ({
              ...prev,
              city: data.places[0]["place name"],
            }));
          }
        })
        .catch(() => {
          // Optionally clear city if zip is invalid
          setFormData((prev) => ({
            ...prev,
            city: "",
          }));
        });
    }
  }, [formData.zipCode, formData.state, zipError]);

  return (
    <div className="container mx-auto px-6 py-12 pt-24">
      {/* Universal Lead ID Fallback */}
      <img src='//create.leadid.com/noscript.gif?lac=6B96394A-E3F0-75F4-8748-80CB63C352C2&lck=548c86c2-3c24-2ec2-b201-274ffb0f5005&snippet_version=2' style={{display: 'none'}} />
      {/* Jornaya LeadiD Token Hidden Input */}
      <input type="hidden" id="leadid_token" name="universalLeadid" />
      {/* Service Title Section */}
      <div className="flex items-center justify-center gap-4 pb-2">
        <h1 className="text-3xl">Get A {title} Consultation!</h1>
        {/* Service Image */}
        {service?.image && (
          <img
            src={service.image}
            alt={`${title} service`}
            className="w-20 h-20 object-contain"
          />
        )}
      </div>
      {/* Service-Specific Inputs */}
      {service?.inputs && (
        <div className="max-w-4xl mx-auto mt-2">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {service?.inputs.map((input, index) => (
                <div className="mb-4" key={index}>
                  <label className="block text-[#1f2020] font-medium mb-2">
                    {input.question}
                  </label>
                  {input.question === "Who is your energy provider?" ? (
                    <div className="relative">
                      <input
                        type="text"
                        value={providerInput}
                        onChange={(e) => {
                          const value = e.target.value;
                          setProviderInput(value);
                          fetchProviders(value);
                          setFormData(prev => ({...prev, ["Who is your energy provider?"]: value}));
                          if (selectedProvider && selectedProvider.name !== value) {
                            setSelectedProvider(null);
                            setFormData(prev => ({...prev, electricalEnergyProviderId: "", electricalEnergyProvider: ""}));
                          }
                        }}
                        className="w-full px-4 py-0.5 border-b-2 border-[#1f2020] rounded-md focus:outline-none focus:ring focus:primary"
                        required
                        placeholder="Type to search energy providers"
                      />
                      {providerSuggestions.length > 0 && (
                        <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
                          {providerSuggestions.map((suggestion) => (
                            <li
                              key={suggestion.id}
                              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => {
                                setSelectedProvider(suggestion);
                                setProviderInput(suggestion.name);
                                setProviderSuggestions([]);
                                setFormData(prev => ({...prev, electricalEnergyProviderId: suggestion.id, electricalEnergyProvider: suggestion.name}));
                              }}
                            >
                              {suggestion.name}
                            </li>
                          ))}
                        </ul>
                      )}
                      <p className="text-sm text-gray-500 mt-1">If not sure, type Other</p>
                    </div>
                  ) : input.options ? (
                    <select
                      name={input.question}
                      value={formData[input.question] || ""}
                      onChange={handleChange}
                      className="w-full px-4 py-0.5 border-b-2 border-[#1f2020] rounded-md focus:outline-none focus:ring focus:primary"
                      required
                    >
                      <option value="">Select an option</option>
                      {input.options.map((option, idx) => (
                        <option key={idx} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : input.type === "date" ? (
                    <input
                      type="date"
                      name={input.question}
                      value={formData[input.question] || ""}
                      onChange={handleChange}
                      className="w-full px-4 py-0.5 border-b-2 border-[#1f2020] rounded-md focus:outline-none focus:ring focus:primary"
                      required
                      min={input.question === "When are you planning to move" ? new Date().toISOString().split('T')[0] : undefined}
                    />
                  ) : (
                        <input
                          type="text"
                          name={input.question}
                          value={formData[input.question] || ""}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (
                              input.question === "Current zip code" ||
                              input.question === "Moving zip code" ||
                              input.question.toLowerCase().includes("zip code")
                            ) {
                              // Only allow numeric input and max 5 digits
                              if (/^\d*$/.test(value)) {
                                setFormData((prevData) => ({
                                  ...prevData,
                                  [input.question]: value.slice(0, 5),
                                }));
                              }
                            } else {
                              handleChange(e);
                            }
                          }}
                          className="w-full px-4 py-0.5 border-b-2 border-[#1f2020] rounded-md focus:outline-none focus:ring focus:primary"
                          required
                          placeholder={
                            input.question === "Current zip code" ||
                            input.question === "Moving zip code" ||
                            input.question.toLowerCase().includes("zip code")
                              ? "Enter 5-digit zip code"
                              : ""
                          }
                          pattern={
                            input.question === "Current zip code" ||
                            input.question === "Moving zip code" ||
                            input.question.toLowerCase().includes("zip code")
                              ? "\\d{5}"
                              : undefined
                          }
                          title={
                            input.question === "Current zip code" ||
                            input.question === "Moving zip code" ||
                            input.question.toLowerCase().includes("zip code")
                              ? "Must be 5 digits"
                              : undefined
                          }
                        />
                      )}
                </div>
              ))}
            </div>
          </form>
        </div>
      )}
      <h1 className="text-3xl text-center pb-2">Tell Us More About You</h1>{" "}
      {/* Single Page Form */}
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 ">
             {/* First Name */}
             <div className="mb-4">
               <label
                 htmlFor="firstName"
                 className="block text-[#1f2020] font-medium"
               >
                 First Name
               </label>
               <input
                 type="text"
                 id="firstName"
                 name="firstName"
                 value={formData.firstName}
                 onChange={(e) => {
                   const value = e.target.value;
                   if (/^[A-Za-z\s]*$/.test(value)) {
                     setFormData((prevData) => ({
                       ...prevData,
                       firstName: value,
                     }));
                   }
                 }}
                 className="w-full px-4 py-0.5 border-b-2 border-[#1f2020] rounded-md focus:outline-none focus:ring focus:primary"
                 required
               />
             </div>

             {/* Last Name */}
             <div className="mb-4">
               <label
                 htmlFor="lastName"
                 className="block text-[#1f2020] font-medium"
               >
                 Last Name
               </label>
               <input
                 type="text"
                 id="lastName"
                 name="lastName"
                 value={formData.lastName}
                 onChange={(e) => {
                   const value = e.target.value;
                   if (/^[A-Za-z\s]*$/.test(value)) {
                     setFormData((prevData) => ({
                       ...prevData,
                       lastName: value,
                     }));
                   }
                 }}
                 className="w-full px-4 py-0.5 border-b-2 border-[#1f2020] rounded-md focus:outline-none focus:ring focus:primary"
                 required
               />
             </div>

             {/* Phone */}
             <div className="mb-4">
               <label
                 htmlFor="phone"
                 className="block text-[#1f2020] font-medium"
               >
                 Phone
               </label>
               <input
                 type="tel"
                 id="phone"
                 name="phone"
                 value={formData.phone}
                 onChange={(e) => {
                   const value = e.target.value.replace(/\D/g, '');
                   setFormData((prevData) => ({
                     ...prevData,
                     phone: value.slice(0, 10),
                   }));
                 }}
                 className="w-full px-4 py-0.5 border-b-2 border-[#1f2020] rounded-md focus:outline-none focus:ring focus:primary"
                 required
               />
               {phoneError && (
                 <p className="text-red-600 text-sm mt-1">{phoneError}</p>
               )}
             </div>

             {/* Email */}
             <div className="mb-4">
               <label
                 htmlFor="email"
                 className="block text-[#1f2020] font-medium"
               >
                 Email
               </label>
               <input
                 type="email"
                 id="email"
                 name="email"
                 value={formData.email}
                 onChange={handleChange}
                 className="w-full px-4 py-0.5 border-b-2 border-[#1f2020] rounded-md focus:outline-none focus:ring focus:primary"
                 required
               />
               {emailError && (
                 <p className="text-red-600 text-sm mt-1">{emailError}</p>
               )}
             </div>
            {/* State */}
            <div className="mb-4">
              <label
                htmlFor="state"
                className="block text-[#1f2020] font-medium"
              >
                State
              </label>
              <select
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="w-full px-4 py-0.5 border-b-2 border-[#1f2020] rounded-md focus:outline-none focus:ring focus:primary"
                required
              >
                <option value="">Select State</option>
                <option value="Alabama">Alabama</option>
                <option value="Alaska">Alaska</option>
                <option value="Arizona">Arizona</option>
                <option value="Arkansas">Arkansas</option>
                <option value="California">California</option>
                <option value="Colorado">Colorado</option>
                <option value="Connecticut">Connecticut</option>
                <option value="Delaware">Delaware</option>
                <option value="Florida">Florida</option>
                <option value="Georgia">Georgia</option>
                <option value="Hawaii">Hawaii</option>
                <option value="Idaho">Idaho</option>
                <option value="Illinois">Illinois</option>
                <option value="Indiana">Indiana</option>
                <option value="Iowa">Iowa</option>
                <option value="Kansas">Kansas</option>
                <option value="Kentucky">Kentucky</option>
                <option value="Louisiana">Louisiana</option>
                <option value="Maine">Maine</option>
                <option value="Maryland">Maryland</option>
                <option value="Massachusetts">Massachusetts</option>
                <option value="Michigan">Michigan</option>
                <option value="Minnesota">Minnesota</option>
                <option value="Mississippi">Mississippi</option>
                <option value="Missouri">Missouri</option>
                <option value="Montana">Montana</option>
                <option value="Nebraska">Nebraska</option>
                <option value="Nevada">Nevada</option>
                <option value="New Hampshire">New Hampshire</option>
                <option value="New Jersey">New Jersey</option>
                <option value="New Mexico">New Mexico</option>
                <option value="New York">New York</option>
                <option value="North Carolina">North Carolina</option>
                <option value="North Dakota">North Dakota</option>
                <option value="Ohio">Ohio</option>
                <option value="Oklahoma">Oklahoma</option>
                <option value="Oregon">Oregon</option>
                <option value="Pennsylvania">Pennsylvania</option>
                <option value="Rhode Island">Rhode Island</option>
                <option value="South Carolina">South Carolina</option>
                <option value="South Dakota">South Dakota</option>
                <option value="Tennessee">Tennessee</option>
                <option value="Texas">Texas</option>
                <option value="Utah">Utah</option>
                <option value="Vermont">Vermont</option>
                <option value="Virginia">Virginia</option>
                <option value="Washington">Washington</option>
                <option value="West Virginia">West Virginia</option>
                <option value="Wisconsin">Wisconsin</option>
                <option value="Wyoming">Wyoming</option>
                <option value="Washington DC">Washington DC</option>
                <option value="Puerto Rico">Puerto Rico</option>
                <option value="Virgin Islands">Virgin Islands</option>
              </select>
            </div>

            {/* Zip Code */}
            <div className="mb-4">
              <label
                htmlFor="zipCode"
                className="block text-[#1f2020] font-medium"
              >
                Zip Code
              </label>
              <input
                type="text"
                id="zipCode"
                name="zipCode"
                value={formData.zipCode}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*$/.test(value)) {
                    setFormData((prevData) => ({
                      ...prevData,
                      zipCode: value.slice(0, 5),
                    }));
                  }
                }}
                className="w-full px-4 py-0.5 border-b-2 border-[#1f2020] rounded-md focus:outline-none focus:ring focus:primary"
                required
              />
              {/* Error Messages */}
              {formData.zipCode.length > 5 && (
                <p className="text-red-600 text-sm mt-1">
                  Zip Code must not exceed 5 digits.
                </p>
              )}
              {formData.zipCode.length > 0 && formData.zipCode.length < 5 && (
                <p className="text-red-600 text-sm mt-1">
                  Zip Code must be exactly 5 digits.
                </p>
              )}
              {zipError && (
                <p className="text-red-600 text-sm mt-1">{zipError}</p>
              )}
            </div>

            {/* City */}
            <div className="mb-4">
              <label
                htmlFor="city"
                className="block text-[#1f2020] font-medium"
              >
                City
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full px-4 py-0.5 border-b-2 border-[#1f2020] rounded-md focus:outline-none focus:ring focus:primary"
                required
              />
            </div>

            {/* Street Address */}
            <div className="mb-4">
              <label
                htmlFor="streetAddress"
                className="block text-[#1f2020] font-medium"
              >
                Street Address
              </label>
              <input
                type="text"
                id="streetAddress"
                name="streetAddress"
                value={formData.streetAddress}
                onChange={handleChange}
                className="w-full px-4 py-0.5 border-b-2 border-[#1f2020] rounded-md focus:outline-none focus:ring focus:primary"
                required
              />
            </div>
          </div>
          {/* Wrapper for the form */}
          <div className="max-w-5xl mx-auto">
            <h1 className="text-3xl text-center mb-7">Few More Things</h1>

            {/* Wrapper for responsive two-column layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Home Owner */}
              <div className="mb-4">
                <label
                  htmlFor="HomeOwner"
                  className="block text-[#1f2020] font-medium"
                >
                  Home Owner:
                </label>
                <select
                  name="HomeOwner"
                  value={formData["HomeOwner"]}
                  onChange={handleChange}
                  className="w-full px-4 py-0.5 border-b-2 border-[#1f2020] rounded-md focus:outline-none focus:ring focus:primary"
                  required
                >
                  <option value="">Select an option</option>
                  <option value="1">Yes</option>
                  <option value="2">No</option>
                </select>
              </div>

              {/* Property Type */}
              <div className="mb-4">
                <label
                  htmlFor="PropertyType"
                  className="block text-[#1f2020] font-medium"
                >
                  Property Type?
                </label>
                <select
                  name="PropertyType"
                  value={formData["PropertyType"]}
                  onChange={handleChange}
                  className="w-full px-4 py-0.5 border-b-2 border-[#1f2020] rounded-md focus:outline-none focus:ring focus:primary"
                  required
                >
                  <option value="">Select an option</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Multi-Unit">Multi-Unit</option>
                  <option value="Residential">Residential</option>
                </select>
              </div>

              {/* Purchase Timeframe */}
              <div className="mb-4">
                <label
                  htmlFor="PurchaseTimeFrame"
                  className="block text-[#1f2020] font-medium"
                >
                  Purchase TimeFrame
                </label>
                <select
                  name="PurchaseTimeFrame"
                  value={formData["PurchaseTimeFrame"]}
                  onChange={handleChange}
                  className="w-full px-4 py-0.5 border-b-2 border-[#1f2020] rounded-md focus:outline-none focus:ring focus:primary"
                  required
                >
                  <option value="">Select an option</option>
                  <option value="1-2 weeks">1-2 weeks</option>
                  <option value="3-4 weeks">3-4 weeks</option>
                  <option value="5-6 weeks">5-6 weeks</option>
                  <option value="7-8 weeks">7-8 weeks</option>
                  <option value="Time Is Flexible">Time Is Flexible</option>
                </select>
              </div>

              {/* Best Time to Call */}
              <div className="mb-4">
                <label
                  htmlFor="BestTimeToCall"
                  className="block text-[#1f2020] font-medium"
                >
                  What is the best time to call you?
                </label>
                <select
                  name="BestTimeToCall"
                  value={formData["BestTimeToCall"]}
                  onChange={handleChange}
                  className="w-full px-4 py-0.5 border-b-2 border-[#1f2020] rounded-md focus:outline-none focus:ring focus:primary"
                  required
                >
                  <option value="">Select an option</option>
                  <option value="Anytime">Anytime</option>
                  <option value="Morning">Morning</option>
                  <option value="Afternoon">Afternoon</option>
                  <option value="Evening">Evening</option>
                </select>
              </div>
            </div>

            {/* Full width input for brief description */}
            <div className="mb-4">
              <label
                htmlFor="Brief data about requirements"
                className="block text-[#1f2020] font-medium"
              >
                Tell us about your service requirements in brief
              </label>
              <textarea
                name="Brief data about requirements"
                value={formData["Brief data about requirements"]}
                onChange={handleChange}
                className="w-full px-4 py-0.5 border-b-2 border-[#1f2020] rounded-md focus:outline-none focus:ring focus:primary resize-none"
                rows="2"
                required
              />
            </div>

            {/* Checkbox for agreement */}
            <div className="mb-4">
              <label className="flex items-start gap-2">
                <input
                  type="checkbox"
                  name="agreement"
                  checked={formData.agreement}
                  onChange={(e) =>
                    setFormData({ ...formData, agreement: e.target.checked })
                  }
                  className={`mt-1 ${
                    !formData.agreement && showError ? "border-red-500" : ""
                  }`}
                />
                <span className="text-sm text-[#1f2020] text-justify">
                  By clicking{" "}
                  <Link to="/services" className="underline  text-blue-400">
                    GET YOUR QUOTE
                  </Link>{" "}
                  , I agree to the{" "}
                  <Link to="/userTerms" className="underline  text-blue-400">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    to="/privacyPolicy"
                    className="underline  text-blue-400"
                  >
                    Privacy Policy
                  </Link>
                  , I authorize home improvement companies, their contractors,
                  and{" "}
                  <Link
                    to="/marketingPartners" 
                    className="underline  text-blue-400"
                  >
                    Partner Companies
                  </Link>{" "}
                  to contact me about home improvement offers by phone calls and
                  text messages to the number I provided. I authorize that these
                  marketing communications may be delivered to me using an
                  automatic telephone dialing system or by prerecorded message.
                  I understand that my consent is not a condition of purchase,
                  and I may revoke that consent at any time. Mobile and data
                  charges may apply. California Residents.
                </span>
              </label>
              {!formData.agreement && showError && (
                <p className="text-red-500 text-sm mt-2">
                  Please check the box to proceed.
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                className={`btn w-full bg-[#ffb000] text-black transition duration-300 flex items-center justify-center ${!isUS ? "opacity-50 cursor-not-allowed" : ""}`}
                disabled={loading || !isUS || !!zipError || !!phoneError || !!emailError || !formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim()}
                onClick={(e) => {
                  const requiredFields =
                    service?.inputs?.map((input) => input.question) || [];
                  const emptyFields = requiredFields.some(
                    (field) => !formData[field] || formData[field] === ""
                  );
                  if (
                    formData.zipCode.length < 5 ||
                    formData.phone.length < 10 ||
                    !formData.agreement ||
                    emptyFields ||
                    !isUS ||
                    !!zipError ||
                    !formData.firstName.trim() ||
                    !formData.lastName.trim() ||
                    !formData.email.trim() ||
                    !!emailError ||
                    !!phoneError
                  ) {
                    e.preventDefault();
                    setShowError(true);
                  } else {
                    setShowError(false);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    const requiredFields =
                      service?.inputs?.map((input) => input.question) || [];
                    const emptyFields = requiredFields.some(
                      (field) => !formData[field] || formData[field] === ""
                    );
                    if (
                      formData.zipCode.length < 5 ||
                      formData.phone.length < 10 ||
                      !formData.agreement ||
                      emptyFields ||
                      !isUS ||
                      !!zipError ||
                      !formData.firstName.trim() ||
                      !formData.lastName.trim() ||
                      !formData.email.trim() ||
                      !!emailError ||
                      !!phoneError
                    ) {
                      setShowError(true);
                    } else {
                      setShowError(false);
                      e.target.click();
                    }
                  }
                }}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 mr-2 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  "Get My Consultation"
                )}
              </button>
              {/* Error Messages */}
              {showError && (
                <p className="text-red-600 text-sm mt-1">
                  Please fill out all required fields before submitting.
                </p>
              )}
              {apiError && (
                <p className="text-red-600 text-sm mt-1">{apiError}</p>
              )}
              {!isUS && ipChecked && (
                <p className="text-red-600 text-sm mt-2">
                  This service is only for US citizens.
                </p>
              )}
            </div>
          </div>
        </form>
      </div>
      {/* How It Works Section */}
      <div className="bg-white py-12">
        <div className="container mx-auto px-6 lg:px-20">
          <h2 className="text-3xl font-bold text-center text-[#1f2020] mb-8 hover:text-[#ffb000] transition duration-300">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ">
            {/* Step 1 */}
            <div className="text-center bg-gray-100 rounded-lg p-6 shadow-md hover:bg-[#ffae00de] transition duration-500 cursor-pointer">
              <div className="text-6xl text-amber-300 mb-4">📝</div>
              <h3 className="text-xl font-bold mb-2">
                Complete The Short Form
              </h3>
              <p className="text-[#1f2020]">
                Answer a few easy questions regarding your project needs to get
                matched with the services you require.
              </p>
            </div>
            {/* Step 2 */}
            <div className="text-center bg-gray-100 rounded-lg p-6 shadow-md hover:bg-[#ffae00de] transition duration-500 cursor-pointer">
              <div className="text-6xl text-amber-300 mb-4">🔍</div>
              <h3 className="text-xl font-bold mb-2">Find Pro Professionals</h3>
              <p className="text-[#1f2020]">
                You can find local home improvement professionals who specialize
                in the type of work you need.
              </p>
            </div>
            {/* Step 3 */}
            <div className="text-center bg-gray-100 rounded-lg p-6 shadow-md hover:bg-[#ffae00de] transition duration-500 cursor-pointer">
              <div className="text-6xl text-amber-300 mb-4">🏠</div>
              <h3 className="text-xl font-bold mb-2">Local Pro In Your Area</h3>
              <p className="text-[#1f2020]">
                Enter your project details, and we will match you with the best
                local contractors.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetails;

const areaCodesUS = [
  205,251,256,334,659,907,480,520,602,623,928,479,501,870,209,213,279,310,323,341,408,415,424,442,510,530,559,
  562,619,626,650,657,661,669,707,714,747,760,805,818,820,831,858,909,916,925,949,951,628,303,719,720,970,
  203,475,860,959,302,202,239,305,321,352,386,407,561,689,727,754,772,786,813,850,863,904,941,954,229,404,
  470,478,678,706,762,770,912,808,208,986,217,224,309,312,331,464,618,630,708,773,815,847,872,219,260,317,
  463,574,765,812,930,319,515,563,641,712,316,620,785,913,270,364,502,606,859,225,318,337,504,985,207,240,
  301,410,443,667,339,351,413,508,617,774,781,857,978,231,248,269,313,517,586,616,734,810,906,947,989,218,
  320,507,612,651,763,952,228,601,662,769,314,417,573,636,660,816,406,308,402,531,702,725,775,603,201,551,
  609,640,732,848,856,862,908,973,505,575,212,315,332,347,516,518,585,607,631,646,716,718,838,845,914,917,
  929,934,252,336,704,743,828,910,919,980,984,701,216,220,234,330,380,419,440,513,567,614,740,937,405,539,
  580,918,458,503,541,971,215,223,267,272,412,445,484,570,610,717,724,814,878,401,803,839,843,854,864,605,
  423,615,629,731,865,901,931,210,214,254,281,325,346,361,409,430,432,469,512,682,713,726,737,806,817,830,
  832,903,915,936,940,945,956,972,979,385,435,801,802,276,434,540,571,703,757,804,826,948,206,253,360,425,
  509,564,304,681,262,414,534,608,715,920,307,787,939,340
];

// Helper for state abbreviation
const stateAbbreviations = {
  "Alabama": "AL", "Alaska": "AK", "Arizona": "AZ", "Arkansas": "AR", "California": "CA", "Colorado": "CO",
  "Connecticut": "CT", "Delaware": "DE", "Florida": "FL", "Georgia": "GA", "Hawaii": "HI", "Idaho": "ID",
  "Illinois": "IL", "Indiana": "IN", "Iowa": "IA", "Kansas": "KS", "Kentucky": "KY", "Louisiana": "LA",
  "Maine": "ME", "Maryland": "MD", "Massachusetts": "MA", "Michigan": "MI", "Minnesota": "MN",
  "Mississippi": "MS", "Missouri": "MO", "Montana": "MT", "Nebraska": "NE", "Nevada": "NV",
  "New Hampshire": "NH", "New Jersey": "NJ", "New Mexico": "NM", "New York": "NY", "North Carolina": "NC",
  "North Dakota": "ND", "Ohio": "OH", "Oklahoma": "OK", "Oregon": "OR", "Pennsylvania": "PA",
  "Rhode Island": "RI", "South Carolina": "SC", "South Dakota": "SD", "Tennessee": "TN", "Texas": "TX",
  "Utah": "UT", "Vermont": "VT", "Virginia": "VA", "Washington": "WA", "West Virginia": "WV",
  "Wisconsin": "WI", "Wyoming": "WY", "Washington DC": "DC", "Puerto Rico": "PR", "Virgin Islands": "VI"
};
