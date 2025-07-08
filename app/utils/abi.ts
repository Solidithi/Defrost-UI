export function getFunctionAbiFromIface(
	factory: any,
	functionName: string
): any {
	return [factory.abi.find((f: any) => f.name === functionName)];
}
