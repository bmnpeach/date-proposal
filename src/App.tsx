import { useState } from "react";
import Page1 from "./pages/Page1";
import Page2 from "./pages/Page2";
import Page3 from "./pages/Page3";
import Page4 from "./pages/Page4";

type Page = 1 | 2 | 3 | 4;

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>(1);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedFood, setSelectedFood] = useState<string | null>(null);

  const handleYes = () => setCurrentPage(2);

  const handleDateConfirm = (date: Date, time: string) => {
    setSelectedDate(date);
    setSelectedTime(time);
    setCurrentPage(3);
  };

  const handleFoodConfirm = (food: string) => {
    setSelectedFood(food);
    setCurrentPage(4);
  };

  return (
    <>
      {currentPage === 1 && <Page1 onYes={handleYes} />}
      {currentPage === 2 && (
        <Page2 onConfirm={handleDateConfirm} />
      )}
      {currentPage === 3 && (
        <Page3 onConfirm={handleFoodConfirm} />
      )}
      {currentPage === 4 && selectedDate && selectedTime && selectedFood && (
        <Page4
          date={selectedDate}
          time={selectedTime}
          food={selectedFood}
        />
      )}
    </>
  );
}
