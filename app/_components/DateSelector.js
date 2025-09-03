"use client";

import {
  differenceInDays,
  isPast,
  isSameDay,
  isWithinInterval,
} from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { useReservation } from "./ReservationContext";

function isAlreadyBooked(range, datesArr) {
  return (
    range?.from &&
    range?.to &&
    datesArr.some((date) =>
      isWithinInterval(date, { start: range?.from, end: range?.to })
    )
  );
}

function DateSelector({ settings, bookedDates, cabin }) {
  // const [range, setRange] = useState({
  //   from: undefined,
  //   to: undefined,
  // });
  const { range, setRange, resetRange } = useReservation();

  const displayedRange = isAlreadyBooked(range, bookedDates) ? {} : range;

  const { regularPrice, discount } = cabin;
  const numNights = differenceInDays(displayedRange.to, displayedRange.from);
  const cabinPrice = numNights * (regularPrice - discount);
  // const range = { from: null, to: null };

  // SETTINGS
  const { minBookingLength, maxBookingLength } = settings;

  return (
    <div className="flex flex-col justify-between">
      <DayPicker
        className="pt-5 place-self-center scale-75"
        mode="range"
        // onSelect={(range) => setRange(range)} we can do like this as well as below it work same
        onSelect={setRange}
        selected={displayedRange}
        min={minBookingLength + 1}
        max={maxBookingLength}
        fromMonth={new Date()}
        fromDate={new Date()}
        toYear={new Date().getFullYear() + 5}
        captionLayout="dropdown"
        numberOfMonths={2}
        classNames={{
          months: "flex flex-row gap-2", // Tailwind for row layout
          selected: "bg-accent-500 text-white", // single day
          range_start: "bg-accent-500 text-white rounded-l-full", // start date
          range_end: "bg-accent-500 text-white rounded-r-full", // end date
          range_middle: "bg-accent-500 text-white", // m
        }}
        disabled={
          (currentDate) =>
            isPast(currentDate) ||
            bookedDates.some((date) => isSameDay(date, currentDate)) // actually we want to return true if currentDate is Same as dates in bookedDates Array so we does not use includes as we need to check using date-fns function so we use some method and includes is not using because may be these dates have different format
        }
      />

      <div className="flex items-center justify-between px-8 bg-accent-500 text-primary-800 h-[62px]">
        <div className="flex items-baseline gap-6">
          <p className="flex gap-2 items-baseline">
            {discount > 0 ? (
              <>
                <span className="text-2xl">${regularPrice - discount}</span>
                <span className="line-through font-semibold text-primary-700">
                  ${regularPrice}
                </span>
              </>
            ) : (
              <span className="text-2xl">${regularPrice}</span>
            )}
            <span className="">/night</span>
          </p>
          {numNights ? (
            <>
              <p className="bg-accent-600 px-3 py-2 text-2xl">
                <span>&times;</span> <span>{numNights}</span>
              </p>
              <p>
                <span className="text-lg font-bold uppercase">Total</span>{" "}
                <span className="text-2xl font-semibold">${cabinPrice}</span>
              </p>
            </>
          ) : null}
        </div>

        {range.from || range.to ? (
          <button
            className="border border-primary-800 py-2 px-4 text-sm font-semibold"
            onClick={resetRange}
          >
            Clear
          </button>
        ) : null}
      </div>
    </div>
  );
}

export default DateSelector;

// this range state we also need in Reservation component so to share this state to that component we have three ways -
//1. Storing date is url this is not prefer as date changes new url created and as navigation changes page will be rerender and if page is rerender then it will fetch all data again so this is not favorable option
//2. Storing this date range in parent component for that we have to make one more component parent of DateSelector and reservation Form and we already know this strategy
//3. Context Api in Next js how we implement to share this date state
// COntext Api only works for client component so we want to share state between server and client we use url method and we want to share state between client components then we use Context Api or redux
