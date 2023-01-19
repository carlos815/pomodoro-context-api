export const requestNotificationPermission = () => {
  if (Notification.permission !== 'granted') {
    Notification.requestPermission(function (status) {
      console.log('Notification permission status:', status)
    })
  }
}

export const displayNotification = (text, options) => {
  if (Notification.permission === 'granted') {
    Notification.onclick = (event) => {
      event.preventDefault(); // prevent the browser from focusing the Notification's tab
      window.open('http://www.mozilla.org', '_blank');
    }
    new Notification(text, {
      icon: '../tomato-icon.png',
      ...options,

    })
  }
}
