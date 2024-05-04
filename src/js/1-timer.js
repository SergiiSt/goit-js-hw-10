import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const refs = {
  timerDaysEl: document.querySelector('[data-days]'),
  timerHoursEl: document.querySelector('[data-hours]'),
  timerMinutesEl: document.querySelector('[data-minutes]'),
  timerSecondsEl: document.querySelector('[data-seconds]'),
  buttonEl: document.querySelector('[data-start]'),
};

let userSelectedDates;

refs.buttonEl.disabled = true;

function makeBtnActive() {
  if (userSelectedDates) {
    refs.buttonEl.disabled = false;
  }
}

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    console.log(selectedDates[0]);
    if (selectedDates[0].getTime() >= options.defaultDate.getTime()) {
      userSelectedDates = selectedDates[0];
      makeBtnActive();
    } else
      iziToast.error({
        position: 'topRight',
        progressBar: false,
        color: '#fc031c',
        message: 'Please choose a date in the future',
      });
  },
};

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

let difference;
let timeObj;
let timerInterval;

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function timer() {
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    if (userSelectedDates) {
      refs.buttonEl.disabled = true;
      //   console.log(userSelectedDates);
      difference = userSelectedDates.getTime() - new Date().getTime();
      if (difference < 0) {
        clearInterval(timerInterval);
        difference = 0;
      }
      timeObj = convertMs(difference);
      updateTimerDisplay(timeObj);
    } else {
      console.log('User has not selected a date yet.');
    }
  }, 1000);
}

function updateTimerDisplay(timeObj) {
  refs.timerDaysEl.innerHTML = addLeadingZero(Math.max(timeObj.days, 0));
  refs.timerHoursEl.innerHTML = addLeadingZero(Math.max(timeObj.hours, 0));
  refs.timerMinutesEl.innerHTML = addLeadingZero(Math.max(timeObj.minutes, 0));
  refs.timerSecondsEl.innerHTML = addLeadingZero(Math.max(timeObj.seconds, 0));
}

refs.buttonEl.addEventListener('click', timer);

const fp = flatpickr('#datetime-picker', options);
