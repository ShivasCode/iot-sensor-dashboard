import { useEffect, useState } from "react";
import { Box, Typography, Card, CardContent, Grid2 } from "@mui/material";
import mqtt from "mqtt";

function App() {
  const [temperature, setTemperature] = useState(null);
  const [humidity, setHumidity] = useState(null);
  const [methane, setMethane] = useState(null);

  const options = {
    username: "admin",
    password: "admin",
    useSSL: false,
    protocolVersion: 5,
    rejectUnauthorized: false,
    clean: true,
  };

  useEffect(() => {
    const client = mqtt.connect('ws://localhost:9001', options);
    client.on("connect", () => {
      console.log("Connected to MQTT broker");
      client.subscribe("sensor/data/");
    });

    client.on("message", (topic, message) => {
      if (topic === "sensor/data/") {
        const data = JSON.parse(message.toString());
        setTemperature(data.temperature);
        setHumidity(data.humidity);
        setMethane(data.mq4);
      }
    });

    return () => {
      client.end();
    };
  }, []);

  return (
    <Box
      sx={{
        minHeight: "100vh", 
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        backgroundColor: "#f0f4f8", 
        
      }}
    > 
    <div className="dashboard-box">
      <Typography
        variant="h3"
        gutterBottom
        sx={{
          color: "#333",
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        Sensor Data Dashboard
      </Typography>

      <Grid2
        container
        spacing={3}
        justifyContent="center"
        alignItems="center"
        sx={{
          maxWidth: 1200,
          marginTop: 3,
        }}
      >
        {/* Temperature Card */}
        <Grid2 item xs={12} sm={4}>
          <Card
            sx={{
              boxShadow: 4,
              borderRadius: "12px",
              backgroundColor: "#ffffff",
              padding: 2,
              transition: "transform 0.3s ease-in-out",
              "&:hover": {
                transform: "scale(1.05)",
              },
            }}
          >
            <CardContent>
              <Typography variant="h6" sx={{ color: "#1976d2", fontWeight: "bold" }}>
                Temperature
              </Typography>
              <Typography variant="h4" sx={{ color: "#333" }}>
                {temperature ? `${temperature} °C` : "Loading..."}
              </Typography>
            </CardContent>
          </Card>
        </Grid2>

        {/* Humidity Card */}
        <Grid2 item xs={12} sm={4}>
          <Card
            sx={{
              boxShadow: 4,
              borderRadius: "12px",
              backgroundColor: "#ffffff",
              padding: 2,
              transition: "transform 0.3s ease-in-out",
              "&:hover": {
                transform: "scale(1.05)",
              },
            }}
          >
            <CardContent>
              <Typography variant="h6" sx={{ color: "#28a745", fontWeight: "bold" }}>
                Humidity
              </Typography>
              <Typography variant="h4" sx={{ color: "#333" }}>
                {humidity ? `${humidity} %` : "Loading..."}
              </Typography>
            </CardContent>
          </Card>
        </Grid2>

        {/* Methane Card */}
        <Grid2 item xs={12} sm={4}>
          <Card
            sx={{
              boxShadow: 4,
              borderRadius: "12px",
              backgroundColor: "#ffffff",
              padding: 2,
              transition: "transform 0.3s ease-in-out",
              "&:hover": {
                transform: "scale(1.05)",
              },
            }}
          >
            <CardContent>
              <Typography variant="h6" sx={{ color: "#e91e63", fontWeight: "bold" }}>
                Methane Level
              </Typography>
              <Typography variant="h4" sx={{ color: "#333" }}>
                {methane ? `${methane} ppm` : "Loading..."}
              </Typography>
            </CardContent>
          </Card>
        </Grid2>
      </Grid2>
      </div>
    </Box>
  );
}

export default App;
