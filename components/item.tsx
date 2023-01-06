import { BigNumber } from "ethers";
import {
	createContext,
	Dispatch,
	ReactElement,
	SetStateAction,
	useContext,
	useState,
} from "react";
import { useContract, useProvider, useSigner } from "wagmi";
import { abi } from "../components/contract";
import { AccessContext } from "./access";
import { ethers } from "ethers";

type Props = {
	children: ReactElement;
};

enum State {
	Harvested, // 0
	Processed, // 1
	Packed, // 2
	ForSale, // 3
	Sold, // 4
	Shipped, // 5
	Received, // 6
	Purchased, // 7
}

const ReverseState = {
	Harvested: 0,
	Processed: 1,
	Packed: 2,
	ForSale: 3,
	Sold: 4,
	Shipped: 5,
	Received: 6,
	Purchased: 7,
};

type Item = {
	sku: string; // Stock Keeping Unit (SKU)
	upc: string; // Universal Product Code (UPC), generated by the Farmer, goes on the package, can be verified by the Consumer
	ownerID: string; // Metamask-Ethereum address of the current owner as the product moves through 8 stages
	originFarmerID: string; // Metamask-Ethereum address of the Farmer
	originFarmName: string; // Farmer Name
	originFarmInformation: string; // Farmer Information
	originFarmLatitude: string; // Farm Latitude
	originFarmLongitude: string; // Farm Longitude
	productID: string; // Product ID potentially a combination of upc + sku
	productNotes: string; // Product Notes
	productPrice: string; // Product Price
	itemState: string; // Product State as represented in the enum above
	distributorID: string; // Metamask-Ethereum address of the Distributor
	retailerID: string; // Metamask-Ethereum address of the Retailer
	consumerID: string; // Metamask-Ethereum address of the Consumer
};

type ItemProps = {
	item: Item;
	setItem: Dispatch<SetStateAction<Item>>;
	upc: BigNumber | undefined;
	itemState: State | undefined;
	harvestedTx: string | undefined;
	processedTx: string | undefined;
	packedTx: string | undefined;
	forSaleTx: string | undefined;
	soldTx: string | undefined;
	shippedTx: string | undefined;
	purchasedTx: string | undefined;
};

const blankItem: Item = {
	sku: "",
	upc: "",
	ownerID: "",
	originFarmerID: "",
	originFarmName: "",
	originFarmInformation: "",
	originFarmLatitude: "",
	originFarmLongitude: "",
	productID: "",
	productNotes: "",
	productPrice: "",
	itemState: "",
	distributorID: "",
	retailerID: "",
	consumerID: "",
};

const ItemContext = createContext<ItemProps>({
	item: blankItem,
	setItem: new Object() as Dispatch<SetStateAction<Item>>,
	upc: undefined,
	itemState: undefined,
	harvestedTx: undefined,
	processedTx: undefined,
	packedTx: undefined,
	forSaleTx: undefined,
	soldTx: undefined,
	shippedTx: undefined,
	purchasedTx: undefined,
});
const { Provider } = ItemContext;

export default function ItemProvider({ children }: Props) {
	const [item, setItem] = useState<Item>(blankItem);
	const { contractAddress, latestTransaction } = useContext(AccessContext);
	const [harvestedTx, setHarvestedTx] = useState<string | undefined>();
	const [processedTx, setProcessedTx] = useState<string | undefined>();
	const [packedTx, setPackedTx] = useState<string | undefined>();
	const [forSaleTx, setForSaleTx] = useState<string | undefined>();
	const [soldTx, setSoldTx] = useState<string | undefined>();
	const [shippedTx, setShippedTx] = useState<string | undefined>();
	const [purchasedTx, setPurchasedTx] = useState<string | undefined>();
	const provider = useProvider();
	const contract = useContract({
		address: contractAddress,
		abi: abi,
		signerOrProvider: provider,
	});

	const upc = item.upc.length > 0 ? BigNumber.from(item.upc) : undefined;
	const itemState = ReverseState[item.itemState as keyof typeof ReverseState];

	const harvested = contract?.filters.Harvested(null);
	const processed = contract?.filters.Processed(null);
	const packed = contract?.filters.Packed(null);
	const forSale = contract?.filters.ForSale(null);
	const sold = contract?.filters.Sold(null);
	const shipped = contract?.filters.Shipped(null);
	const purchased = contract?.filters.Purchased(null);

	if (upc !== undefined) {
		if (harvested) {
			provider
				.getLogs({
					...harvested,
					fromBlock: 0,
				})
				.then((logs) => {
					setHarvestedTx(
						logs.find((log) => {
							return BigNumber.from(log.data).eq(upc as BigNumber);
						})?.transactionHash
					);
				});
		}

		if (processed) {
			provider
				.getLogs({
					...processed,
					fromBlock: 0,
				})
				.then((logs) => {
					setProcessedTx(
						logs.find((log) => {
							return BigNumber.from(log.data).eq(upc as BigNumber);
						})?.transactionHash
					);
				});
		}

		if (packed) {
			provider
				.getLogs({
					...packed,
					fromBlock: 0,
				})
				.then((logs) => {
					setPackedTx(
						logs.find((log) => {
							return BigNumber.from(log.data).eq(upc as BigNumber);
						})?.transactionHash
					);
				});
		}

		if (forSale) {
			provider
				.getLogs({
					...forSale,
					fromBlock: 0,
				})
				.then((logs) => {
					setForSaleTx(
						logs.find((log) => {
							return BigNumber.from(log.data).eq(upc as BigNumber);
						})?.transactionHash
					);
				});
		}

		if (sold) {
			provider
				.getLogs({
					...sold,
					fromBlock: 0,
				})
				.then((logs) => {
					setSoldTx(
						logs.find((log) => {
							return BigNumber.from(log.data).eq(upc as BigNumber);
						})?.transactionHash
					);
				});
		}

		if (shipped) {
			provider
				.getLogs({
					...shipped,
					fromBlock: 0,
				})
				.then((logs) => {
					setShippedTx(
						logs.find((log) => {
							return BigNumber.from(log.data).eq(upc as BigNumber);
						})?.transactionHash
					);
				});
		}

		if (purchased) {
			provider
				.getLogs({
					...purchased,
					fromBlock: 0,
				})
				.then((logs) => {
					setPurchasedTx(
						logs.find((log) => {
							return BigNumber.from(log.data).eq(upc as BigNumber);
						})?.transactionHash
					);
				});
		}
	}

	const props: ItemProps = {
		item,
		setItem,
		upc,
		itemState,
		harvestedTx,
		processedTx,
		packedTx,
		forSaleTx,
		soldTx,
		shippedTx,
		purchasedTx,
	};

	return <Provider value={props}>{children}</Provider>;
}

export { ItemContext, type Item, State, blankItem };
