import { useCallback, useContext, useRef, useState } from "react";
import {
  FlatList,
  View,
  Text,
  Alert,
  RefreshControl,
  Pressable,
  TextInput,
} from "react-native";
import tw from "twrnc";
import Balance from "../components/Balance";
import UserContext from "../UserContext";
import MonthSwitcher from "../components/MonthSwitcher";
import Loading from "../components/Loading";
import { calculateSpent } from "../math";
import MonthInfo from "../components/MonthInfo";
import Transaction from "../components/Transaction";
import {
  createTransaction,
  getAllTransactions,
  isCurrentMonth,
  updateMonthAmount,
} from "../lib";
import {
  Check,
  ChevronDown,
  ChevronUp,
  Minus,
  Plus,
} from "lucide-react-native";
import ColorSchemeContext from "../ColorSchemeContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Modal from "react-native-modal";
import Input from "../components/Input";
import RNDateTimePicker, {
  DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";
import Button from "../components/Button";
import DropDownPicker from "react-native-dropdown-picker";
import ReloginBanner from "../components/ReloginBanner";

const Home: React.FC = () => {
  const [, colorScheme] = useContext(ColorSchemeContext);
  const [user, setUser] = useContext(UserContext);
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const [month, setMonth] = useState(currentMonth);
  const [year, setYear] = useState(currentYear);
  const [refreshing, setRefreshing] = useState(false);
  const insets = useSafeAreaInsets();
  const [amount, setAmount] = useState(
    user?.months[`${month.toString().padStart(2, "0")}-${year}`] ??
      user?.defaultSpendable ??
      0
  );
  const [addingNewTransaction, setAddingNewTransaction] = useState(false);
  const [newNameValue, setNewNameValue] = useState("");
  const [newDateValue, setNewDateValue] = useState(new Date());
  const [newAmountValue, setNewAmountValue] = useState("");
  const [newAmountSign, setNewAmountSign] = useState<"positive" | "negative">(
    "negative"
  );
  const [banks, setBanks] = useState(user?.banks ?? []);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownValue, setDropdownValue] = useState("");
  const newTransactionNameRef = useRef<TextInput>(null);
  const newTransactionAmountRef = useRef<TextInput>(null);

  function onModalClose() {
    setAddingNewTransaction(false);
    setNewNameValue("");
    setNewDateValue(new Date());
    setNewAmountValue("");
  }

  if (!user) {
    throw new Error("no user in home screen");
  }

  const getTransactions = useCallback(async () => {
    setRefreshing(true);

    getAllTransactions(user.id).then((res) => {
      if (!res.ok) {
        Alert.alert("Transaction Sync Failed");
        return;
      }
      setUser({
        ...user,
        transactions: res.value.transactions,
        loggedOutBanks: res.value.loggedOutBanks,
      });
      setRefreshing(false);
    });
  }, [user, setUser]);

  if (!user) {
    return <Loading />;
  }

  if (!user.transactions) {
    return <Loading />;
  }

  const monthTransactions = user.transactions.filter((transaction) => {
    return (
      Number(transaction.date.split("-")[1]) === month + 1 &&
      Number(transaction.date.split("-")[0]) === year
    );
  });

  const unignoredMonthTransactions = monthTransactions.filter(
    (transaction) => !transaction.ignore
  );

  let firstTransaction = { month: 0, year: new Date().getFullYear() };
  if (user.transactions.length) {
    const firstTransactionDate = user.transactions.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return Number(dateA) - Number(dateB);
    })[0].date;
    firstTransaction = {
      month: Number(firstTransactionDate.split("-")[1]) - 1,
      year: Number(firstTransactionDate.split("-")[0]),
    };
  }

  const spent = calculateSpent(
    user.defaultSpendable,
    unignoredMonthTransactions.map((i) => i.amount)
  );

  const sorted = monthTransactions.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return Number(dateB) - Number(dateA);
  });

  const monthIsCurrent = isCurrentMonth(new Date(year, month));
  const monthIsLast =
    firstTransaction.month === month && firstTransaction.year === year;

  function forwardMonth() {
    if (monthIsCurrent) {
      return;
    }
    let newYear = year;
    let newMonth;
    if (month === 11) {
      newYear = year + 1;
      newMonth = 0;
    } else {
      newMonth = month + 1;
    }
    setAmount(
      user?.months[`${newMonth.toString().padStart(2, "0")}-${newYear}`] ??
        user?.defaultSpendable ??
        0
    );
    setMonth(newMonth);
    setYear(newYear);
  }

  function backwardMonth() {
    if (monthIsLast) {
      return;
    }
    let newMonth;
    let newYear;
    if (month === 0) {
      newYear = year - 1;
      newMonth = 11;
    } else {
      newYear = year;
      newMonth = month - 1;
    }
    setAmount(
      user?.months[`${newMonth.toString().padStart(2, "0")}-${newYear}`] ??
        user?.defaultSpendable ??
        0
    );
    setMonth(newMonth);
    setYear(newYear);
  }

  return (
    <View
      style={tw`bg-white dark:bg-zinc-900 items-center flex flex-1 pt-[${
        insets.top + 4
      }] pb-[${insets.bottom}]`}
    >
      <Modal
        avoidKeyboard={true}
        isVisible={addingNewTransaction}
        onBackdropPress={onModalClose}
      >
        <View
          style={tw`justify-center items-center bg-white rounded-lg px-6 py-4 dark:bg-zinc-900`}
        >
          <Pressable
            onPress={() => {
              newTransactionNameRef.current?.blur();
              newTransactionAmountRef.current?.blur();
              setDropdownOpen(false);
            }}
            style={tw`w-full`}
          >
            <Text
              style={tw`text-2xl font-bold text-teal-800 pb-5 dark:text-teal-600`}
            >
              Add Custom Transaction
            </Text>

            <View style={tw`w-full gap-3`}>
              <View>
                <Text
                  style={tw`ml-1 mb-1 text-teal-900/80 dark:text-zinc-500 uppercase font-semibold text-xs tracking-wide`}
                >
                  Account
                </Text>

                <DropDownPicker
                  open={dropdownOpen}
                  value={dropdownValue}
                  items={banks.map((i) => {
                    return { label: i.name, value: i.id };
                  })}
                  setItems={setBanks}
                  setOpen={(value) => {
                    setDropdownOpen(value);
                    newTransactionAmountRef.current?.blur();
                    newTransactionNameRef.current?.blur();
                  }}
                  setValue={setDropdownValue}
                  placeholder="Select an account"
                  style={tw`${
                    dropdownOpen
                      ? "border-teal-500 rounded-xl"
                      : "dark:border-zinc-600 border-zinc-300 border-b rounded-full"
                  } bg-zinc-50 dark:bg-zinc-800 px-4 py-2 min-h-2`}
                  textStyle={tw`text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-300`}
                  dropDownContainerStyle={tw`border-t-zinc-400 dark:border-t-zinc-500 ${
                    dropdownOpen
                      ? "border-teal-500"
                      : "dark:border-zinc-800 border-zinc-300"
                  } bg-zinc-50 dark:bg-zinc-800 rounded-xl`}
                  listMode="SCROLLVIEW"
                  itemSeparator={true}
                  itemSeparatorStyle={tw`bg-zinc-400 dark:bg-zinc-600 mx-2`}
                  TickIconComponent={() => (
                    <Check
                      style={tw`dark:text-zinc-400 text-zinc-500`}
                      size={20}
                    />
                  )}
                  ArrowUpIconComponent={() => (
                    <ChevronUp
                      style={tw`dark:text-zinc-400 text-zinc-500`}
                      size={20}
                    />
                  )}
                  ArrowDownIconComponent={() => (
                    <ChevronDown
                      style={tw`dark:text-zinc-400 text-zinc-500`}
                      size={20}
                    />
                  )}
                  props={{ activeOpacity: 1 }}
                />
              </View>

              <Pressable
                onPress={() => setDropdownOpen(false)}
                style={tw`-z-10`}
              >
                <Input
                  onFocus={() => setDropdownOpen(false)}
                  ref={newTransactionNameRef}
                  type="text"
                  onChange={setNewNameValue}
                  value={newNameValue}
                  placeholder=""
                  small
                >
                  Transaction Name
                </Input>
              </Pressable>

              <View style={tw`flex flex-row justify-between -z-10 gap-2`}>
                <View style={tw`flex`}>
                  <Text
                    style={tw`ml-1 mb-1 text-teal-900/80 dark:text-zinc-500 uppercase font-semibold text-xs tracking-wide`}
                  >
                    Date
                  </Text>

                  {tw.prefixMatch("android") ? (
                    <Pressable
                      onPress={() => {
                        DateTimePickerAndroid.open({
                          value: newDateValue,
                          onChange: (e, date) =>
                            setNewDateValue(date ?? new Date()),
                          mode: "date",
                          is24Hour: true,
                        });
                      }}
                      style={tw`bg-zinc-50 dark:bg-zinc-800 px-4 py-3 w-full rounded-lg border-[1px] border-zinc-300 dark:border-zinc-600`}
                    >
                      <Text
                        style={tw`dark:text-zinc-300`}
                      >{`${newDateValue.toLocaleString("default", {
                        month: "short",
                      })} ${newDateValue.getDate()}, ${newDateValue.getFullYear()}`}</Text>
                    </Pressable>
                  ) : (
                    <RNDateTimePicker
                      key={tw.memoBuster}
                      style={tw`-ml-2 mt-auto mb-2 -z-10`}
                      value={newDateValue}
                      themeVariant={colorScheme}
                      accentColor={"#1f938c"}
                      onChange={(event, date) => {
                        setDropdownOpen(false);
                        event.type === "set"
                          ? date
                            ? setNewDateValue(date)
                            : {}
                          : {};
                      }}
                    />
                  )}
                </View>

                <View style={tw`flex w-1/2`}>
                  <Text
                    style={tw`ml-1 mb-1 text-teal-900/80 dark:text-zinc-500 uppercase font-semibold text-xs tracking-wide`}
                  >
                    Amount
                  </Text>
                  <View style={tw`flex flex-row gap-1`}>
                    <Pressable
                      hitSlop={{ right: 7, left: 9, top: 8, bottom: 10 }}
                      style={tw`bg-zinc-50 dark:bg-zinc-800 border-zinc-200 border rounded-full flex items-center justify-center w-8 h-8 self-center dark:border-zinc-600`}
                      onPress={() =>
                        setNewAmountSign(
                          newAmountSign === "negative" ? "positive" : "negative"
                        )
                      }
                    >
                      {newAmountSign === "negative" ? (
                        <Plus
                          size={15}
                          style={tw`text-green-600 dark:text-green-500`}
                          strokeWidth={4}
                        />
                      ) : (
                        <Minus
                          size={19}
                          style={tw`text-red-600/75 dark:text-red-700/75`}
                          strokeWidth={3}
                        />
                      )}
                    </Pressable>

                    <Pressable
                      onPress={() => setDropdownOpen(false)}
                      style={tw`-z-10 flex-1`}
                    >
                      <Input
                        style={`${
                          newAmountSign === "positive"
                            ? "text-red-600 dark:text-red-600"
                            : "text-green-600 dark:text-green-500"
                        }`}
                        onFocus={() => setDropdownOpen(false)}
                        type="number"
                        ref={newTransactionAmountRef}
                        onChange={setNewAmountValue}
                        value={newAmountValue}
                        placeholder=""
                        small
                      ></Input>
                    </Pressable>
                  </View>
                </View>
              </View>

              <View style={tw`flex flex-row gap-2 pt-2 -z-10`}>
                <Button
                  onPress={onModalClose}
                  color="zinc-400"
                  darkColor="zinc-700"
                  small
                >
                  Cancel
                </Button>

                <Button
                  disabled={
                    !dropdownValue ||
                    !newNameValue ||
                    !newDateValue ||
                    !newAmountValue
                      ? true
                      : false
                  }
                  onPress={async () => {
                    if (
                      !dropdownValue ||
                      !newNameValue ||
                      !newDateValue ||
                      !newAmountValue
                    ) {
                      return;
                    }

                    await createTransaction(
                      dropdownValue,
                      newNameValue,
                      formatDate(newDateValue),
                      Number(newAmountValue) *
                        (newAmountSign === "positive" ? 1 : -1)
                    );
                    onModalClose();

                    const res = await getAllTransactions(user.id);

                    if (!res.ok) {
                      console.error("failed to get new transactions");
                      return;
                    }

                    setUser({
                      ...user,
                      transactions: [...res.value.transactions],
                      loggedOutBanks: res.value.loggedOutBanks,
                    });
                  }}
                  color="teal-600"
                  darkColor="teal-700"
                  small
                >
                  Create
                </Button>
              </View>
            </View>
          </Pressable>
        </View>
      </Modal>

      <FlatList
        data={user.loggedOutBanks}
        style={tw`flex-grow-0 flex-shrink-0`}
        contentContainerStyle={tw`mb-2`}
        renderItem={({ item: bank_id }) => (
          <ReloginBanner
            bank={user.banks.find((bank) => bank.id === bank_id) ?? null}
          />
        )}
      />

      <FlatList
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={getTransactions}
            colors={colorScheme === "dark" ? ["white"] : ["gray"]}
            tintColor={colorScheme === "dark" ? "white" : "gray"}
            progressBackgroundColor={
              colorScheme === "dark" ? tw.color("zinc-900") : "white"
            }
          />
        }
        stickyHeaderIndices={[0]}
        ListHeaderComponent={
          <>
            <MonthSwitcher
              year={year}
              forwardMonth={forwardMonth}
              backwardMonth={backwardMonth}
              month={month}
              monthIsCurrent={monthIsCurrent}
              monthIsLast={monthIsLast}
            />
            <Balance spent={spent} spendable={amount} />
            <MonthInfo
              updateMonthlySpendable={(newAmount: number) => {
                setAmount(newAmount);
                updateMonthAmount(newAmount, user.id, month, year);
              }}
              spendable={amount}
              spent={spent}
              month={month}
              year={year}
            />

            <View style={tw`flex flex-row items-center w-full p-2`}>
              <Text
                style={tw`uppercase font-bold text-xs text-teal-900 dark:text-teal-600 grow`}
              >
                Merchant
              </Text>
              <Text
                style={tw`uppercase font-bold text-xs w-18 text-teal-900 dark:text-teal-600`}
              >
                Date
              </Text>
              <Text
                style={tw`uppercase font-bold text-xs w-21 text-teal-900 dark:text-teal-600`}
              >
                Amount
              </Text>
              <Pressable
                onPress={() => setAddingNewTransaction(true)}
                hitSlop={{ top: 26, left: 25, right: 10, bottom: 10 }}
              >
                <Text>
                  <Plus
                    style={tw`text-teal-900 dark:text-teal-600`}
                    size={18}
                  />
                </Text>
              </Pressable>
            </View>
          </>
        }
        ListHeaderComponentStyle={tw`flex items-center w-full bg-white dark:bg-zinc-900 gap-2`}
        ItemSeparatorComponent={() => (
          <View style={tw`h-[1px] bg-zinc-100 dark:bg-zinc-800 mx-2`} />
        )}
        style={tw`w-full`}
        contentContainerStyle={tw`flex items-center gap-1`}
        data={sorted}
        renderItem={(transaction) => (
          <Transaction transaction={transaction.item} />
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

export default Home;

function formatDate(date: Date): string {
  const year = date.getFullYear().toString().padStart(4, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");

  return `${year}-${month}-${day}`;
}
