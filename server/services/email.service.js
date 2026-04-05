// services/email.service.js
const nodemailer = require("nodemailer");

// ============================================
// CREATE TRANSPORTER
// ============================================
const createTransporter = () => {
  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT, 10),
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// ============================================
// BASE SEND EMAIL
// ============================================
const sendEmail = async ({ to, subject, html }) => {
  const transporter = createTransporter();

  const info = await transporter.sendMail({
    from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM}>`,
    to,
    subject,
    html,
  });

  console.log("Email sent:", info.messageId);
  return info;
};

// ============================================
// CONTACT - ADMIN NOTIFICATION ✅ (No changes needed)
// ============================================
const sendContactToAdmin = async (contact) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; color: #333; }
        .container { max-width: 600px; margin: 0 auto; }
        .header { background: #000; color: #fff; padding: 25px; text-align: center; }
        .header h1 { margin: 0; font-size: 22px; letter-spacing: 2px; }
        .badge { display: inline-block; padding: 5px 15px; background: #e3f2fd; color: #1565c0; border-radius: 20px; font-size: 11px; font-weight: bold; margin-top: 10px; text-transform: uppercase; }
        .content { padding: 25px; }
        .field { margin-bottom: 12px; }
        .label { font-size: 11px; color: #888; text-transform: uppercase; font-weight: bold; }
        .value { font-size: 15px; margin-top: 3px; }
        .message-box { background: #f5f5f5; border-left: 4px solid #000; padding: 15px; margin: 15px 0; }
        .booking-box { background: #fff8e1; border: 1px solid #ffe082; padding: 15px; border-radius: 5px; margin: 15px 0; }
        .footer { text-align: center; padding: 15px; color: #999; font-size: 11px; border-top: 1px solid #eee; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>LA MODELS</h1>
          <span class="badge">${contact.inquiryType}</span>
        </div>
        <div class="content">
          <div class="field">
            <div class="label">Name</div>
            <div class="value">${contact.name}</div>
          </div>
          <div class="field">
            <div class="label">Email</div>
            <div class="value"><a href="mailto:${contact.email}">${contact.email}</a></div>
          </div>
          ${contact.phone ? `<div class="field"><div class="label">Phone</div><div class="value">${contact.phone}</div></div>` : ""}
          ${contact.company ? `<div class="field"><div class="label">Company</div><div class="value">${contact.company}</div></div>` : ""}
          <div class="field">
            <div class="label">Subject</div>
            <div class="value">${contact.subject}</div>
          </div>
          <div class="message-box">
            <div class="label">Message</div>
            <p>${contact.message}</p>
          </div>
          ${
            contact.inquiryType === "model-booking" && contact.bookingDetails
              ? `
          <div class="booking-box">
            <strong>Booking Details</strong>
            ${contact.bookingDetails.modelName ? `<p>Model: ${contact.bookingDetails.modelName}</p>` : ""}
            ${contact.bookingDetails.projectType ? `<p>Project: ${contact.bookingDetails.projectType}</p>` : ""}
            ${contact.bookingDetails.shootDate ? `<p>Date: ${new Date(contact.bookingDetails.shootDate).toLocaleDateString()}</p>` : ""}
            ${contact.bookingDetails.location ? `<p>Location: ${contact.bookingDetails.location}</p>` : ""}
          </div>`
              : ""
          }
        </div>
        <div class="footer">Received on ${new Date().toLocaleString()}</div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: process.env.ADMIN_EMAIL,
    subject: `New ${contact.inquiryType} - ${contact.subject}`,
    html,
  });
};

// ============================================
// CONTACT - USER CONFIRMATION ✅ (No changes needed)
// ============================================
const sendContactConfirmation = async (contact) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; color: #333; }
        .container { max-width: 600px; margin: 0 auto; }
        .header { background: #000; color: #fff; padding: 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 22px; letter-spacing: 2px; }
        .content { padding: 30px; }
        .summary { background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #999; font-size: 11px; border-top: 1px solid #eee; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>LA MODELS</h1>
        </div>
        <div class="content">
          <h2>Hi ${contact.name},</h2>
          <p>Thank you for contacting LA Models. We have received your message and will respond within <strong>24-48 hours</strong>.</p>
          <div class="summary">
            <p><strong>Subject:</strong> ${contact.subject}</p>
            <p><strong>Message:</strong> ${contact.message}</p>
          </div>
          <p>Best regards,<br><strong>LA Models Team</strong></p>
        </div>
        <div class="footer">
          <p>LA Models | Los Angeles, CA</p>
          <p>This is an automated message. Please do not reply.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: contact.email,
    subject: "Thank you for contacting LA Models",
    html,
  });
};

// ============================================
// APPLICATION - ADMIN NOTIFICATION ✅ (FIXED to match schema)
// ============================================
const sendApplicationToAdmin = async (application) => {
  // Helper to safely access nested values
  const get = (obj, path, fallback = "N/A") => {
    return path.split(".").reduce((o, k) => (o || {})[k], obj) || fallback;
  };

  // Calculate age from dateOfBirth
  const age = application.dateOfBirth
    ? Math.floor((new Date() - new Date(application.dateOfBirth)) / 31557600000)
    : "N/A";

  // Format height
  const height = application.stats?.height
    ? `${application.stats.height.feet || ""}' ${application.stats.height.inches || ""}" (${application.stats.height.cm || ""} cm)`
    : "N/A";

  // Format location
  const location =
    [
      application.location?.city,
      application.location?.state,
      application.location?.country,
    ]
      .filter(Boolean)
      .join(", ") || "N/A";

  // Check if male stats or female stats
  const isMale = application.gender === "male";

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; }
        .header { background: #000; color: #fff; padding: 25px; text-align: center; }
        .header h1 { margin: 0; font-size: 22px; letter-spacing: 2px; }
        .badge { display: inline-block; padding: 5px 15px; background: #c62828; color: #fff; border-radius: 20px; font-size: 11px; font-weight: bold; margin-top: 10px; text-transform: uppercase; }
        .division-badge { display: inline-block; padding: 5px 15px; background: #1565c0; color: #fff; border-radius: 20px; font-size: 11px; font-weight: bold; margin: 5px; }
        .content { padding: 25px; }
        .section { margin: 20px 0; }
        .section-title { font-size: 14px; font-weight: bold; color: #000; border-bottom: 2px solid #000; padding-bottom: 5px; margin-bottom: 15px; text-transform: uppercase; }
        .field { margin-bottom: 10px; }
        .label { font-size: 11px; color: #888; text-transform: uppercase; font-weight: bold; }
        .value { font-size: 15px; margin-top: 2px; }
        table { width: 100%; border-collapse: collapse; margin: 10px 0; }
        td { padding: 8px; border: 1px solid #ddd; font-size: 14px; }
        td:first-child { font-weight: bold; width: 40%; background: #fafafa; }
        .photos { margin: 15px 0; }
        .photos img { width: 120px; height: 160px; object-fit: cover; margin: 5px; border-radius: 5px; border: 1px solid #ddd; }
        .parent-box { background: #fff3e0; border: 1px solid #ffcc80; padding: 15px; border-radius: 5px; margin: 10px 0; }
        .experience-box { background: #e8f5e9; border: 1px solid #a5d6a7; padding: 15px; border-radius: 5px; margin: 10px 0; }
        .social-box { background: #e3f2fd; border: 1px solid #90caf9; padding: 15px; border-radius: 5px; margin: 10px 0; }
        .footer { text-align: center; padding: 15px; color: #999; font-size: 11px; border-top: 1px solid #eee; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>LA MODELS</h1>
          <br/>
          <span class="badge">NEW APPLICATION</span>
          <br/>
          <span class="division-badge">${get(application, "applyingFor.division")}</span>
          ${application.applyingFor?.categories?.map((c) => `<span class="division-badge">${c}</span>`).join("") || ""}
        </div>

        <div class="content">
          <!-- Personal Info -->
          <div class="section">
            <div class="section-title">Personal Information</div>
            <table>
              <tr><td>Name</td><td>${application.firstName} ${application.lastName}</td></tr>
              <tr><td>Email</td><td><a href="mailto:${application.email}">${application.email}</a></td></tr>
              <tr><td>Phone</td><td>${application.phone || "N/A"}</td></tr>
              <tr><td>Gender</td><td>${application.gender || "N/A"}</td></tr>
              <tr><td>Date of Birth</td><td>${application.dateOfBirth ? new Date(application.dateOfBirth).toLocaleDateString() : "N/A"}</td></tr>
              <tr><td>Age</td><td>${age}</td></tr>
              <tr><td>Ethnicity</td><td>${application.ethnicity || "N/A"}</td></tr>
              <tr><td>Location</td><td>${location}</td></tr>
            </table>
          </div>

          <!-- Physical Stats -->
          <div class="section">
            <div class="section-title">Physical Stats</div>
            <table>
              <tr><td>Height</td><td>${height}</td></tr>
              <tr><td>Weight</td><td>${application.stats?.weight?.lbs ? `${application.stats.weight.lbs} lbs (${application.stats.weight.kg} kg)` : "N/A"}</td></tr>
              ${
                isMale
                  ? `
                <tr><td>Chest</td><td>${get(application, "stats.chest")}</td></tr>
                <tr><td>Waist</td><td>${get(application, "stats.waist")}</td></tr>
                <tr><td>Suit</td><td>${get(application, "stats.suit")}</td></tr>
                <tr><td>Shirt</td><td>${get(application, "stats.shirt")}</td></tr>
                <tr><td>Neck</td><td>${get(application, "stats.neck")}</td></tr>
                <tr><td>Sleeve</td><td>${get(application, "stats.sleeve")}</td></tr>
                <tr><td>Inseam</td><td>${get(application, "stats.inseam")}</td></tr>
              `
                  : `
                <tr><td>Bust</td><td>${get(application, "stats.bust")}</td></tr>
                <tr><td>Cup</td><td>${get(application, "stats.cup")}</td></tr>
                <tr><td>Waist</td><td>${get(application, "stats.waist")}</td></tr>
                <tr><td>Hips</td><td>${get(application, "stats.hips")}</td></tr>
                <tr><td>Dress</td><td>${get(application, "stats.dress")}</td></tr>
              `
              }
              <tr><td>Shoe</td><td>${get(application, "stats.shoe")}</td></tr>
              <tr><td>Hair Color</td><td>${get(application, "stats.hairColor")}</td></tr>
              <tr><td>Eye Color</td><td>${get(application, "stats.eyeColor")}</td></tr>
            </table>
          </div>

          <!-- Parent/Guardian (if exists) -->
          ${
            application.parent?.name
              ? `
          <div class="section">
            <div class="section-title">Parent / Guardian</div>
            <div class="parent-box">
              <table>
                <tr><td>Name</td><td>${application.parent.name}</td></tr>
                <tr><td>Relationship</td><td>${application.parent.relationship || "N/A"}</td></tr>
                <tr><td>Phone</td><td>${application.parent.phone || "N/A"}</td></tr>
                <tr><td>Email</td><td>${application.parent.email || "N/A"}</td></tr>
              </table>
            </div>
          </div>`
              : ""
          }

          <!-- Experience -->
          ${
            application.experience
              ? `
          <div class="section">
            <div class="section-title">Experience</div>
            <div class="experience-box">
              <p><strong>Level:</strong> ${get(application, "experience.level")}</p>
              ${application.experience.description ? `<p><strong>Description:</strong> ${application.experience.description}</p>` : ""}
              ${application.experience.previousAgencies?.length > 0 ? `<p><strong>Previous Agencies:</strong> ${application.experience.previousAgencies.join(", ")}</p>` : ""}
              ${application.experience.portfolio?.clients?.length > 0 ? `<p><strong>Clients:</strong> ${application.experience.portfolio.clients.join(", ")}</p>` : ""}
              ${application.experience.portfolio?.campaigns?.length > 0 ? `<p><strong>Campaigns:</strong> ${application.experience.portfolio.campaigns.join(", ")}</p>` : ""}
              ${application.experience.portfolio?.editorials?.length > 0 ? `<p><strong>Editorials:</strong> ${application.experience.portfolio.editorials.join(", ")}</p>` : ""}
            </div>
          </div>`
              : ""
          }

          <!-- Skills -->
          ${
            application.skills
              ? `
          <div class="section">
            <div class="section-title">Skills</div>
            <table>
              ${application.skills.acting ? `<tr><td>Acting</td><td>✅ Yes</td></tr>` : ""}
              ${application.skills.dancing ? `<tr><td>Dancing</td><td>✅ Yes</td></tr>` : ""}
              ${application.skills.singing ? `<tr><td>Singing</td><td>✅ Yes</td></tr>` : ""}
              ${application.skills.sports?.length > 0 ? `<tr><td>Sports</td><td>${application.skills.sports.join(", ")}</td></tr>` : ""}
              ${application.skills.languages?.length > 0 ? `<tr><td>Languages</td><td>${application.skills.languages.join(", ")}</td></tr>` : ""}
              ${application.skills.instruments?.length > 0 ? `<tr><td>Instruments</td><td>${application.skills.instruments.join(", ")}</td></tr>` : ""}
              ${application.skills.other?.length > 0 ? `<tr><td>Other</td><td>${application.skills.other.join(", ")}</td></tr>` : ""}
            </table>
          </div>`
              : ""
          }

          <!-- Social Media -->
          ${
            application.social
              ? `
          <div class="section">
            <div class="section-title">Social Media</div>
            <div class="social-box">
              ${application.social.instagram ? `<p>📸 Instagram: <a href="https://instagram.com/${application.social.instagram.replace("@", "")}">${application.social.instagram}</a> ${application.social.followers?.instagram ? `(${application.social.followers.instagram.toLocaleString()} followers)` : ""}</p>` : ""}
              ${application.social.tiktok ? `<p>🎵 TikTok: ${application.social.tiktok} ${application.social.followers?.tiktok ? `(${application.social.followers.tiktok.toLocaleString()} followers)` : ""}</p>` : ""}
              ${application.social.youtube ? `<p>📺 YouTube: ${application.social.youtube} ${application.social.followers?.youtube ? `(${application.social.followers.youtube.toLocaleString()} subscribers)` : ""}</p>` : ""}
              ${application.social.twitter ? `<p>🐦 Twitter: ${application.social.twitter}</p>` : ""}
            </div>
          </div>`
              : ""
          }

          <!-- Additional Info -->
          ${
            application.additionalInfo
              ? `
          <div class="section">
            <div class="section-title">Additional Information</div>
            <table>
              ${application.additionalInfo.howDidYouHear ? `<tr><td>How Did You Hear</td><td>${application.additionalInfo.howDidYouHear}</td></tr>` : ""}
              ${application.additionalInfo.referredBy ? `<tr><td>Referred By</td><td>${application.additionalInfo.referredBy}</td></tr>` : ""}
              ${application.additionalInfo.scoutName ? `<tr><td>Scout</td><td>${application.additionalInfo.scoutName} ${application.additionalInfo.scoutCode ? `(${application.additionalInfo.scoutCode})` : ""}</td></tr>` : ""}
              <tr><td>Available to Travel</td><td>${application.additionalInfo.availableToTravel ? "✅ Yes" : "❌ No"}</td></tr>
              <tr><td>Available to Relocate</td><td>${application.additionalInfo.availableToRelocate ? "✅ Yes" : "❌ No"}</td></tr>
              <tr><td>Valid Passport</td><td>${application.additionalInfo.hasValidPassport ? "✅ Yes" : "❌ No"}</td></tr>
              ${application.additionalInfo.visaStatus ? `<tr><td>Visa Status</td><td>${application.additionalInfo.visaStatus}</td></tr>` : ""}
              <tr><td>Legal to Work</td><td>${application.additionalInfo.legalToWork ? "✅ Yes" : "❌ No"}</td></tr>
            </table>
          </div>`
              : ""
          }

          <!-- Photos -->
          ${
            application.photos?.length > 0
              ? `
          <div class="section">
            <div class="section-title">Photos (${application.photos.length})</div>
            <div class="photos">
              ${application.photos
                .map(
                  (p) => `
                <div style="display: inline-block; text-align: center; margin: 5px;">
                  <img src="${p.url}" alt="${p.type || "Photo"}" />
                  <div style="font-size: 10px; color: #888; margin-top: 3px;">${p.type || ""}</div>
                </div>
              `,
                )
                .join("")}
            </div>
          </div>`
              : ""
          }

          <!-- Video -->
          ${
            application.introVideo?.url
              ? `
          <div class="section">
            <div class="section-title">Introduction Video</div>
            <p><a href="${application.introVideo.url}">▶️ Watch Video</a></p>
            ${application.introVideo.thumbnail ? `<img src="${application.introVideo.thumbnail}" style="width: 200px; border-radius: 5px;" />` : ""}
          </div>`
              : ""
          }
        </div>

        <div class="footer">
          <p>Received on ${new Date().toLocaleString()}</p>
          <p>Source: ${get(application, "submission.source", "website")} | IP: ${get(application, "submission.ipAddress", "N/A")}</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: process.env.ADMIN_EMAIL,
    subject: `New Model Application - ${application.firstName} ${application.lastName} [${get(application, "applyingFor.division")}]`,
    html,
  });
};

// ============================================
// APPLICATION - USER CONFIRMATION ✅ (FIXED)
// ============================================
const sendApplicationConfirmation = async (application) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; }
        .header { background: #000; color: #fff; padding: 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 22px; letter-spacing: 2px; }
        .content { padding: 30px; }
        .summary { background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .step { margin: 10px 0; padding: 10px; display: flex; align-items: center; }
        .step-num { background: #000; color: #fff; width: 30px; height: 30px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 15px; flex-shrink: 0; }
        .footer { text-align: center; padding: 20px; color: #999; font-size: 11px; border-top: 1px solid #eee; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>LA MODELS</h1>
        </div>
        <div class="content">
          <h2>Hi ${application.firstName},</h2>
          <p>Thank you for applying to LA Models! We have received your application.</p>

          <div class="summary">
            <p><strong>Division:</strong> ${application.applyingFor?.division || "N/A"}</p>
            <p><strong>Categories:</strong> ${application.applyingFor?.categories?.join(", ") || "N/A"}</p>
            <p><strong>Submitted:</strong> ${new Date().toLocaleDateString()}</p>
          </div>

          <h3>What happens next?</h3>
          <div class="step">
            <div class="step-num">1</div>
            <div>Our team reviews your application (1-2 weeks)</div>
          </div>
          <div class="step">
            <div class="step-num">2</div>
            <div>If selected, we'll contact you for an interview</div>
          </div>
          <div class="step">
            <div class="step-num">3</div>
            <div>Meet with our agents at our LA office</div>
          </div>

          <p style="margin-top: 20px;">Due to high volume, we may not respond to every application individually.</p>
          <p>Best of luck!<br><strong>LA Models Team</strong></p>
        </div>
        <div class="footer">
          <p>LA Models | Los Angeles, CA</p>
          <p>This is an automated message. Please do not reply.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: application.email,
    subject: "Application Received - LA Models",
    html,
  });
};

// ============================================
// VERIFY CONNECTION
// ============================================
const verifyConnection = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log("✅ Email service is ready");
    return true;
  } catch (error) {
    console.error("❌ Email service error:", error.message);
    return false;
  }
};

module.exports = {
  sendEmail,
  sendContactToAdmin,
  sendContactConfirmation,
  sendApplicationToAdmin,
  sendApplicationConfirmation,
  verifyConnection,
};
