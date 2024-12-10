export default function Chips({items}) {
  return (
    <div className="flex justify-end">
      {items.map((item, i) =>
        <span key={`${item}-${i}`}
              className="bg-gray-700 text-gray-300 rounded-full px-2 py-1 text-sm ml-2">{item}</span>
      )}
    </div>
  );
}