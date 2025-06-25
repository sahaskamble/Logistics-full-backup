export const RoleCheckByPathName = (path) => {
	switch (path) {
		case "/customer/login":
			return 'Customer';
			break;

		case "/client/login":
			return 'Merchant';
			break;

		case "/gol/login":
			return 'Gol'
		default:
			break;
	}
}
