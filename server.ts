import app from "./src";

app.on("error", (error) => {
  console.error(error);
});

process.on("unhandledRejection", (error) => {
  console.error("UnhandledRejection", error);
  console.error("Exiting...");
  process.exit(1);
});
