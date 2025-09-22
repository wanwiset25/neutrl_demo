const express = require("express");
const client = require('prom-client');
const bodyParser = require("body-parser");
const { error } = require("console");

const app = express();
app.use(express.json()); 
const PORT = process.env.PORT || 3001;


app.post("/transaction", (req, res) => {
  try {
    const transactionData = req.body;
    if (validateTransaction(transactionData)) {
      res.status(200).json({
        success: true,
        message: "Transaction is valid",
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Invalid transaction data",
      });
    }
  } catch (error) {
    console.error("Error processing transaction:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

app.get("/health", (req, res) => {
  res.status(200).send({ status: "healthy" });
});

// Create counters
const successCounter = new client.Counter({
    name: 'transaction_success_total',
    help: 'Total successful transactions'
});

const failureCounter = new client.Counter({
    name: 'transaction_failure_total',
    help: 'Total failed transactions'
});

// Metrics endpoint
app.get("/metrics", async (req, res) => {
    console.log("Metrics endpoint called from", req.ip, req.headers['user-agent']);
    console.log("returning metrics", await client.register.metrics());
    res.set('Content-Type', client.register.contentType);
    res.send(await client.register.metrics());
    
});


function validateTransaction(data) {
  try {
    if (data["signatures"].length < 2) {
      throw new Error("Not enough signatures");
    }
    const signatureSet = new Set(data.signatures);
    if (signatureSet.size !== data.signatures.length) {
      throw new Error("Duplicate signatures found");
    }
    successCounter.inc();
    log(data.transaction_id, "success");
    return true;
  } catch (error) {
    console.error("Validation error:", error);
    failureCounter.inc();
    log(data.transaction_id, "failure", error.message);
    return false;
  }
}

function log(transaction_id, result, message) {
  log_object = {
    timestamp: new Date().toISOString(),
    message: message,
    transaction_id: transaction_id,
    result: result,
  };
  console.log(JSON.stringify(log_object));
}


// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\nShutting down server...');
    process.exit(0);
});