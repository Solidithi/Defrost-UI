export async function GET() {
	return Response.json({
		message: "If you see this, congrats, you are authenticated!",
	});
}
