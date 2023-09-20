const express = require('express');
const app = express();
const authRoutes = require('./routes/authRoutes');

app.use(express.json());

// Mount the authentication routes
app.use('/auth', authRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
