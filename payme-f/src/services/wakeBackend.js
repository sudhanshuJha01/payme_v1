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
  } catch (error) {
    console.log("Backend wake-up attempt finished");
  }
};