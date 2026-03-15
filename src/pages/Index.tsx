import nightStreetBg from "@/assets/night-street-bg.jpg";
import Stars from "@/components/Stars";
import ChatInterface from "@/components/ChatInterface";

const Index = () => {
  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* Background image */}
      <img
        src={nightStreetBg}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Overlay gradient for readability */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.45) 100%)",
        }}
      />

      {/* Stars */}
      <Stars />

      {/* Chat */}
      <ChatInterface />
    </div>
  );
};

export default Index;
