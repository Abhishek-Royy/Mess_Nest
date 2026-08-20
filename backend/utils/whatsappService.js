/**
 * WhatsApp Notification Service for Mess&Nest
 * Generates formatted WhatsApp messages & direct wa.me dispatch links
 */

function formatPhoneNumber(phone) {
  if (!phone) return '';
  // Remove all non-digits
  let cleaned = phone.replace(/[^0-9]/g, '');
  // If 10 digits (Indian standard), prepend 91 country code
  if (cleaned.length === 10) {
    cleaned = '91' + cleaned;
  }
  return cleaned;
}

function buildWhatsAppMessage({ status, studentName, propertyTitle, bookingId, moveInDate, durationMonths }) {
  const shortId = bookingId ? bookingId.toString().slice(-6).toUpperCase() : 'N/A';
  const name = studentName || 'Student';
  const title = propertyTitle || 'Accommodation';

  if (status === 'Confirmed') {
    return (
      `🏠 *Mess&Nest - Booking Confirmation Update*\n\n` +
      `Hello *${name}*,\n` +
      `🎉 Great news! Your booking request for *"${title}"* (Booking ID: *#${shortId}*) has been *CONFIRMED* by the property manager.\n\n` +
      `📅 *Expected Move-in:* ${moveInDate || 'As discussed'}\n` +
      `⏳ *Stay Duration:* ${durationMonths || 6} Months\n` +
      `📍 *Property:* ${title}\n\n` +
      `The accommodation manager has received your details and will contact you for room keys and visit schedule.\n\n` +
      `Thank you for using *Mess&Nest*!`
    );
  } else if (status === 'Rejected') {
    return (
      `🏠 *Mess&Nest - Booking Update*\n\n` +
      `Hello *${name}*,\n` +
      `Regarding your booking request for *"${title}"* (Booking ID: *#${shortId}*):\n` +
      `Unfortunately, this accommodation is currently at full capacity for your selected dates and could not be confirmed.\n\n` +
      `🔍 Please explore other available PGs, flats, and mess accommodations on Mess&Nest:\n` +
      `http://localhost:5173\n\n` +
      `Thank you for using *Mess&Nest*!`
    );
  } else {
    return (
      `🏠 *Mess&Nest - Booking Status Update*\n\n` +
      `Hello *${name}*,\n` +
      `Your booking request for *"${title}"* (Booking ID: *#${shortId}*) is currently *${status}*.\n\n` +
      `Thank you for using *Mess&Nest*!`
    );
  }
}

function generateWhatsAppUrl(phone, message) {
  const formattedPhone = formatPhoneNumber(phone);
  const encodedText = encodeURIComponent(message);
  return `https://wa.me/${formattedPhone}?text=${encodedText}`;
}

async function sendWhatsAppNotification({ phone, status, studentName, propertyTitle, bookingId, moveInDate, durationMonths }) {
  const formattedPhone = formatPhoneNumber(phone);
  const messageText = buildWhatsAppMessage({
    status,
    studentName,
    propertyTitle,
    bookingId,
    moveInDate,
    durationMonths
  });

  const whatsappUrl = generateWhatsAppUrl(formattedPhone, messageText);

  console.log(`\n📱 [WhatsApp Notification Dispatched]`);
  console.log(`   To: +${formattedPhone} (${studentName})`);
  console.log(`   Status: ${status}`);
  console.log(`   Link: ${whatsappUrl}\n`);

  return {
    success: true,
    phone: formattedPhone,
    message: messageText,
    whatsappUrl: whatsappUrl
  };
}

module.exports = {
  formatPhoneNumber,
  buildWhatsAppMessage,
  generateWhatsAppUrl,
  sendWhatsAppNotification
};
