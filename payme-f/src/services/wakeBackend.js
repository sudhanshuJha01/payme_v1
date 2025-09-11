export const wakeBackend = async () => {
  try {

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    await fetch("https://payme-p2p.onrender.com/test", {
      method: "GET",
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    console.log("Backend wake-up triggered");


    if (!window.keepAliveInterval) {
      window.keepAliveInterval = setInterval(async () => {
        try {
          const pingController = new AbortController();
          const pingTimeout = setTimeout(() => pingController.abort(), 8000);

          await fetch("https://payme-p2p.onrender.com/test", {
            method: "GET",
            signal: pingController.signal,
          });

          clearTimeout(pingTimeout);
          console.log("🏓 Backend keep-alive ping successful");
        } catch (error) {
          console.log("🏓 Backend keep-alive ping finished");
        }
      }, 8 * 60 * 1000); 


      window.addEventListener('beforeunload', () => {
        if (window.keepAliveInterval) {
          clearInterval(window.keepAliveInterval);
          window.keepAliveInterval = null;
        }
      });
    }

  } catch (error) {
    console.log("Backend wake-up attempt finished");
  }
};

export const stopKeepAlive = () => {
  if (window.keepAliveInterval) {
    clearInterval(window.keepAliveInterval);
    window.keepAliveInterval = null;
    console.log("Keep-alive stopped");
  }
};