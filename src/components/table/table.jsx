import { FixedSizeList as List } from "react-window";

const VirtualTable = ({ Row, rowCount, data }) => {
  return (
    <div style={{ height: 500, width: "100%" }}>
      <List
        height={500}
        width={"100%"}
        itemCount={rowCount}
        itemSize={70}
        itemData={data}
      >
        {Row}
      </List>
    </div>
  );
};

export default VirtualTable;
