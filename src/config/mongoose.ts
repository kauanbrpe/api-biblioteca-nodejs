import mongoose from "mongoose";

export const connectMongo = async (): Promise<void> => {
    const uri = process.env.MONGODB_URI;

    if (!uri) {
        throw new Error("MONGODB_URI não definida no .env");
    }

    try {
        await mongoose.connect(uri);
        console.log("✅ MongoDB conectado");
    } catch (error) {
        console.error("❌ Erro ao conectar no MongoDB:", error);
        process.exit(1);
    }
};