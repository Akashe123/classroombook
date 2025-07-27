let bookings = JSON.parse(localStorage.getItem('bookingsList')) || [];

function renderRooms() {
  const roomList = document.getElementById('room-list');
  roomList.innerHTML = '';

  const rooms = [
    { id: 3, name: 'LECTURE HALL', image: 'images/room1.jpg', description: 'Perfect for small group discussions and meetings' },
    { id: 4, name: 'SEMINAR HALL', image: 'images/room2.jpg', description: 'Ideal for lectures and presentations' },
    { id: 5, name: 'LIBRARY ROOM', image: 'images/lib.jpg', description: 'Comfortable and quiet for study' },
  ];

  rooms.forEach(room => {
    const card = document.createElement('div');
    card.className = 'room-card';
    card.innerHTML = `
      <img src="${room.image}" alt="${room.name}" />
      <div class="info">
        <h3>${room.name}</h3>
        <p>${room.description}</p>
        <button onclick="openModal('${room.name}', ${room.id})">Book Now</button>
      </div>
    `;
    roomList.appendChild(card);
  });
}

function openModal(roomName, roomId) {
  document.getElementById('modal-room-name').textContent = roomName;
  document.getElementById('booking-form').dataset.roomId = roomId;
  document.getElementById('booking-modal').style.display = 'flex';
}

function closeModal() {
  document.getElementById('booking-modal').style.display = 'none';
}

function closeContactModal() {
  document.getElementById('contact-modal').style.display = 'none';
}

function submitBooking(event) {
  event.preventDefault();
  const form = event.target;
  const roomId = parseInt(form.dataset.roomId);
  const roomName = document.getElementById('modal-room-name').textContent;
  const startDate = form.start.value;
  const endDate = form.end.value;
  const startTime = form.startTime.value;
  const endTime = form.endTime.value;
  const purpose = form.purpose.value;

  const newStart = new Date(`${startDate}T${startTime}`);
  const newEnd = new Date(`${endDate}T${endTime}`);

  const isOverlap = bookings.some(b => {
    if (b.roomId !== roomId) return false;
    const existingStart = new Date(`${b.startDate}T${b.startTime}`);
    const existingEnd = new Date(`${b.endDate}T${b.endTime}`);
    return newStart < existingEnd && newEnd > existingStart;
  });

  if (isOverlap) {
    alert('Room not available at this time. Please choose a different slot.');
    return;
  }

  const booking = { roomId, roomName, startDate, endDate, startTime, endTime, purpose };
  bookings.push(booking);
  localStorage.setItem('bookingsList', JSON.stringify(bookings));

  alert('Room successfully booked!');
  closeModal();
  form.reset();
}

document.addEventListener('DOMContentLoaded', () => {
  renderRooms();

  document.getElementById('home-link').addEventListener('click', (e) => {
    e.preventDefault();
    location.reload();
  });

  document.getElementById('contact-link').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('contact-modal').style.display = 'flex';
  });
});
