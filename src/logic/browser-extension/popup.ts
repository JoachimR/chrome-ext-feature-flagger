export function closePopup(
	windowInstance: { close: () => void } = window,
): void {
	windowInstance.close()
}
