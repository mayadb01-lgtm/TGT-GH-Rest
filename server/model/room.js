import { Schema, model } from "mongoose";

const roomSchema = new Schema({
  roomNumber: { type: Number, required: true, unique: true },
  roomType: { type: String, required: true },
  roomCost: { type: Number, required: true },
});

const Room = model("Room", roomSchema);

// ✅ Auto-initialize only if collection is empty
const initRooms = async () => {
  const count = await Room.estimatedDocumentCount();

  if (count === 0) {
    const roomCost = {
      1: 1800,
      2: 1800,
      3: 1800,
      4: 1800,
      5: 1800,
      6: 2200,
      7: 2200,
      8: 1500,
      9: 1500,
      10: 1500,
      11: 1500,
    };

    const roomType = {
      1: "Deluxe",
      2: "Deluxe",
      3: "Deluxe",
      4: "Deluxe",
      5: "Deluxe",
      6: "3 Bed",
      7: "3 Bed",
      8: "2 Bed",
      9: "2 Bed",
      10: "2 Bed",
      11: "2 Bed",
    };

    const roomNumber = {
      1: 1,
      2: 2,
      3: 3,
      4: 4,
      5: 5,
      6: 6,
      7: 7,
      8: 8,
      9: 9,
      10: 10,
      11: 11,
    };

    const rooms = Object.keys(roomNumber).map((key) => ({
      roomNumber: roomNumber[key],
      roomType: roomType[key],
      roomCost: roomCost[key],
    }));

    await Room.insertMany(rooms);
    console.log("✅ Default rooms initialized");
  }
};

// Immediately run initialization logic
initRooms().catch((err) => console.error("❌ Init failed:", err));

export default model("Room", roomSchema);
