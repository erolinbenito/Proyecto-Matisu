import "dotenv/config";
import app from "./src/config/server.js";
import userRoutes from "./src/routes/userRoutes.js";
import productRoutes from "./src/routes/productRoutes.js";
import orderRoutes from "./src/routes/orderRoutes.js";
import errorHandler from "./src/middlewares/errorHandler.js";

// Rutas
app.use("/api/usuarios", userRoutes);
app.use("/api/productos", productRoutes);
app.use("/api/pedidos", orderRoutes);

// Middleware de manejo de errores
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
