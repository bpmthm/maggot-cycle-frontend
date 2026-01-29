export default function Status_Badge({ status }) {
  const color =
    status === "menunggu"
      ? "orange"
      : status === "dijemput"
      ? "blue"
      : "green";

  return (
    <span className={`badge ${color}`}>
      {status.toUpperCase()}
    </span>
  );
}
