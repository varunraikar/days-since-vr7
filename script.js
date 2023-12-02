document.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById('addEventButton').addEventListener('click', function() {
        document.getElementById('eventForm').style.display = 'block';
    });

    document.getElementById('saveEventButton').addEventListener('click', addEvent);
    loadEvents();
});

function addEvent() {
    var eventName = document.getElementById('eventName').value;
    var eventDate = new Date(document.getElementById('eventDate').value).toISOString();
    var event = { name: eventName, date: eventDate };
    saveEvent(event);
    displayEvent(event);
    document.getElementById('eventName').value = '';
    document.getElementById('eventDate').value = '';
    document.getElementById('eventForm').style.display = 'none';
}

function saveEvent(event) {
    let events = JSON.parse(localStorage.getItem('events')) || [];
    events.push(event);
    localStorage.setItem('events', JSON.stringify(events));
}

function loadEvents() {
    let events = JSON.parse(localStorage.getItem('events')) || [];
    events.forEach(event => displayEvent(event));
}

function displayEvent(event) {
    var today = new Date();
    var eventDate = new Date(event.date);
    var diffTime = Math.abs(today - eventDate);
    var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

    var li = document.createElement("li");
    li.textContent = diffDays + " days - " + event.name;
    li.setAttribute('data-event-name', event.name);
    li.setAttribute('data-days', diffDays);

    var deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.onclick = function() { deleteEvent(li, event) };
    deleteButton.classList.add('deleteButton');
    li.appendChild(deleteButton);

    li.addEventListener('click', function(e) {
        if (e.target !== deleteButton) {
            displayBoxes(this);
        }
    });

    document.getElementById("eventList").appendChild(li);
}

function deleteEvent(eventElement, event) {
    eventElement.remove();
    let events = JSON.parse(localStorage.getItem('events')) || [];
    let filteredEvents = events.filter(e => e.name !== event.name || e.date !== event.date);
    localStorage.setItem('events', JSON.stringify(filteredEvents));
}

function displayBoxes(listItem) {
    var eventName = listItem.getAttribute('data-event-name');
    var days = listItem.getAttribute('data-days');
    var container = document.getElementById('boxesContainer');

    if (container.getAttribute('data-current-event') === eventName) {
        container.innerHTML = '';
        container.removeAttribute('data-current-event');
        return;
    }

    container.innerHTML = '';
    container.setAttribute('data-current-event', eventName);

    for (var i = 0; i < 365; i++) {
        var box = document.createElement('div');
        box.classList.add('dayBox');
        if (i < days) {
            box.classList.add('filled');
        }
        container.appendChild(box);
    }
}
