import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  prop,
  path,
  sortWith,
  descend,
  head,
  reduce,
  groupBy,
  keys,
  length,
  sortBy,
  map,
} from "ramda";

import registerApi from "../api/register-api";
import companyApi from "../api/company-api";
import { updateCreatedAtFromFirebaseDate } from "../helper/datetime-helper";
import { useAuth } from "../component/AuthContext";
import ShadowBox from "../component/ShawdowBox";

const style = {
  root: { maxWidth: "1700px" },
};

const getPiChartData = (nameSelector, valueSelector, data) => {
  const grouped = groupBy(nameSelector, data);
  let res = reduce(
    (acc, cur) => {
      const items = grouped[cur];
      acc = acc.concat({ name: cur, value: valueSelector(items) });
      return acc;
    },
    [],
    keys(grouped)
  );
  res = sortBy(prop("name"), res);
  return res;
};

const sortByCreatedAtDesc = (data) =>
  sortWith(
    [descend(path(["name"])), descend(path(["whenCreated"]))],
    updateCreatedAtFromFirebaseDate(data)
  );

export default function HomePage() {
  const [registerData, setRegisterData] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [events, setEvents] = useState([]);
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    companyApi.get().then((res) => {
      const sorted = sortByCreatedAtDesc(res.data);
      setEvents(sorted);
      setSelectedEvent(prop("code", head(sorted)));
    });
  }, []);

  useEffect(() => {
    if (selectedEvent) {
      registerApi.getByEvent(selectedEvent).then((res) => {
        const data = sortByCreatedAtDesc(res.data);
        setRegisterData(data);
      });
    }
  }, [selectedEvent]);

  if (!auth.user) {
    navigate("/login");
  }

  // const handleChangeEvent = (e) => {
  //   setSelectedEvent(e.target.value);
  // };

  // const handleRowsChange = (data, row) => {
  //   const updatedData = data[head(row.indexes)];
  //   registerApi.update(updatedData);
  //   setRegisterData(map((d) => (d.id === updatedData.id ? updatedData : d)));
  // };

  return (
    <div id="home-page" className="mx-auto" style={style.root}>
      <ShadowBox className="p-5">
        {/* <Row className="mb-2">
                    <Row className="whitespace-nowrap">
                        이벤트: <Dropdown className="ml-2" style={{maxWidth: '300px'}} items={events} value={selectedEvent} valueSelector={prop('code')} textSelector={prop('name')} onChange={handleChangeEvent}/>
                    </Row>
                    <div className='mt-2 md:mt-0 md:ml-5'>
                        총 등록수: {registerData.length}
                    </div>
                </Row>
                <Row className="mt-10">
                    <PieChart text="나이 별" data={orderByAge(prop('name'), getPiChartData(prop('ageRange'), length, registerData))}/>
                    <PieChart text="지역 별" data={orderByArea(prop('name'), getPiChartData(prop('area'), length, registerData))}/>
                </Row> 
                <div>
                    <DataGrid data={registerData} className='mt-5' downloadFileName={`${selectedEvent}.csv`} onRowsChange={handleRowsChange} />
                </div>*/}
      </ShadowBox>
    </div>
  );
}
