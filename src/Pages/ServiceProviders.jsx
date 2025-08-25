import React from 'react';

const ServiceProviders = () => {
  const marketingPartners = [
    "1800 Remodel", "21st Century Power Solutions", "33Mile Radius", "360 Media Direct", "4 Legal Leads",
    "5 Mile Media", "800Medigap", "ABC Leads", "ADT", "ADT Solar", "Admaric", "Admediary", "Adopt-a-Contractor",
    "Adsparkx", "AdvertisingResults.com", "AgedLeadStore.com", "AHCPAIGAll Digital Promotions",
    "All Directions Express", "All Web Leads", "Alphatech Resource Holdings s.r.o.", "Ambient Home Solutions",
    "American Classified Services, Inc.", "Apollo Interactives", "Aptive – Calls", "ArcadeYum LLC", "Astoria",
    "BBRS Group", "Benefit Advisors", "BenefitLogix", "BestQuotesBetter PPC", "BLX", "Blue Ink Digital",
    "BlueWing Ads", "Bold Media Group", "BPODKS Marketing", "BuyerLink", "C3 Data, LLC", "Cadence Media Partners",
    "Call Center Partnerships", "Cedar Tree Media", "Cege Media", "Chain Effect Ads", "Clean Energy Concepts",
    "Clean Energy Experts", "Client Consent Solar", "Contactability", "Consumer Advocacy LLC", "Consumer Genius",
    "Contractor Appointments", "Coverage Choice LLC", "Cre8tive Marketing", "Defense Tax", "Diablo Media",
    "Digital Market Media", "Direct Web Advertising", "Discover", "Dobak Holdings", "Drobu Media", "eCrux LLC",
    "ELocal", "EMedia", "Emerald Enterprise Corp", "Empire Today LLC", "Energy Alliance", "ETN America",
    "Everquote", "Everquote’s Marketing Partners", "Exact Customer", "Excel Impact", "EZ Solar Electric",
    "EZ Solar Inc.", "Fields of Leads Ltd.", "Fields of Leads", "FiveStrata", "Forever Solar", "Fused Leads LLC",
    "Grey Peaks", "Grow My Firm Online", "Guidestar Marketing Group LLC", "Harvest Energy Solutions",
    "Harvest Power", "Harvest Power LLC", "Harvest Solar and Wind Power", "HasTraffic", "HauteProspects","HK Flavors Limited", "Home Improvement", "HomeAdvisor", "HomeBulletin.net", "HomeExpert", "Homely", "HVAC.com", "HyperTarget Marketing",
"iCall Solutions", "Ideal Concepts", "Ideal Concepts, Inc", "Inboxed LLC", "Inbounds.com", "Inbounds LLC",
"Innovation Direct Group", "Insure Choice LLC", "IntelHouse Marketing", "Kallstar", "KB Synergy", "Kevin Ferrell Inc",
"Lead Origins", "Lead Prosper LLC", "Lead Realm LLC", "Lead Realm", "Lead to the Top", "LeadingResponse",
"Leadrilla", "Legal Brand Marketing", "Legal Brand Marketing, LLC", "Let’s Make a Lead LLC", "LightFire Partners",
"Line East Leads", "LoanDepot", "Localrity", "Lowes", "Lumio, HX", "Mantra Digital", "Measureable Revenue",
"Media Power Marketing", "MediaMix", "Member Services", "Meredith Performance Marketing", "Modernize", "Momentum",
"Momentum Solar", "MVX Sales", "MxV Connections", "Narrate LLC", "NationalHomeProject", "Networx", "New Power",
"Next Wave Marketing", "Next Wave Marketing Strategies, Inc", "NextGen Leads", "OfferWeb", "OnCore Leads",
"Online Insurance Solutions LLC", "Onyx Digital Media", "OpenJar Concepts", "Open Home Pros", "Orbit Energy",
"Orbit Energy and Power", "Orkin", "Otis Production LLC", "Outside the Box Designs", "Parasol Media",
"Peak Performance", "Ping Leads", "Pella", "Pinnacle Publishers LLC", "Policy Scout", "PolicyBind, LLC",
"PolicyScout", "Porch.com", "Power Home Remodeling", "Power Source Marketing", "Power Source Marketing LL",
"Powered By The People", "Practical Marketing", "Precise Leads", "Presidio Interactive", "Presidio Interactive Corp",
"Primerica",
"Prospex Digital", "Purple Dog Marketing LLC", "Qatalyst", "Quantum 3 Media LLC", "QuickQuote", "Quicken Loans",
"Quinstreet", "QuoteStorm", "Quotewizard", "RA Roofing", "Rank Media", "RateMarketPlace", "Refi pros",
"Reliable Partners (Trips Marketing)", "Reliance Litigation", "Remodelwell", "Renewal by Andersen", "Reply",
"Resource Marketing Corp.", "ReviMedia", "RevPoint Media", "RexDirect", "Right Advisors LLC", "RingDirect",
"RingPartner", "Rising Results, Inc", "Rodgers No Ka Oi LLC", "RXSun", "S.B. Fintech Ltd", "Sears", "Select Quote",
"Simply Solar", "Smart Home Innovations LLC", "Smart Greet Solar", "Smart Match Insurance Solutions",
"Social Media Consulting Inc.", "Solar America", "Solar Direct Marketing", "Solar Research Group",
"Solar Revolution", "SolidQuote", "Spartan Home Services", "SpeedyQuote.net", "Spring EQ", "Spring Venture Group",
"SS Telemarketing", "State Energy LLC", "Sun Made Solutions", "Sunflowr Fusion", "SunPro Solar", "Suntuity",
"Suntuity Solar", "Synergy Marketing Associates", "Support First", "Tailored Sun LLC", "Tallac Media",
"The-Solar-Project", "Thrive Marketing", "Total Advocacy Group LLC", "TradeMarc Global, LLC", "Trademark America",
"Traffic Panda", "Trips Marketing LLC", "Trusted Consumer Advisors", "TrustedConsumer LLC", "UE Authority Partners", 
"UPT Media", "US Marketing Group", "United Medicare Advisors", "Upforce Media", "Vertigen LLC", "Visiqua", "Voxify", 
"Voxify LLC", "Walker Advertising", "Wasatch Marketing", "Washington United LLC", "We Improve For You", "WeCall", 
"WellPoint", "Wicked Good Leads", "Window Joe", "Yasha Marketing", "Your Best Leads", "Your Web Calls"

  ];

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 pt-10">
      <div className="bg-gradient-to-tr from-amber-500 to-[#1f2020] text-black text-center py-16 px-6 w-full hover">
        <h1 className="text-4xl font-bold pt-5 cursor-pointer">Marketing Partners</h1>
      </div>
      <ul className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {marketingPartners.map((partner, index) => (
          <li key={index} className="text-gray-700 text-sm border-b py-1">
            {partner}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ServiceProviders;
