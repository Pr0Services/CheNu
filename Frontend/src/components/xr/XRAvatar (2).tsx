import { XRParticipant } from "../../types/xr";

type XRAvatarProps = {
  participant: XRParticipant;
};

export function XRAvatar({ participant }: XRAvatarProps) {
  return (
    <group position={participant.position}>
      {/* Avatar sphere */}
      <mesh position={[0, 0.5, 0]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial color={participant.color} />
      </mesh>

      {/* Body capsule (simple cylinder) */}
      <mesh position={[0, -0.1, 0]}>
        <cylinderGeometry args={[0.15, 0.2, 0.6, 16]} />
        <meshStandardMaterial color={participant.color} />
      </mesh>
    </group>
  );
}

// 2D Fallback version
type XRAvatar2DProps = {
  participant: XRParticipant;
};

export function XRAvatar2D({ participant }: XRAvatar2DProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "8px",
      }}
    >
      <div
        style={{
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          background: participant.color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontWeight: "bold",
          fontSize: "16px",
        }}
      >
        {participant.name.charAt(0)}
      </div>
      <span style={{ marginTop: "4px", fontSize: "12px", color: "#333" }}>
        {participant.name}
      </span>
    </div>
  );
}
