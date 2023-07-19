/**
* USE RESIZE CANVAS
* <canvas id="my-canvas" width="480" height="270" />
* const canvasCtx = canvas.getContext("2d")
* const { xOffset, yOffset, newWidth, newHeight } = resizeCanvas(video, canvas);
* canvasCtx.drawImage(video, xOffset, yOffset, newWidth, newHeight);
*/
function resizeCanvas(srcNode, canvasNode) {
    var wrh = srcNode.width / srcNode.height;
    var newWidth = canvasNode.width;
    var newHeight = newWidth / wrh;
    if (newHeight > canvasNode.height) {
        newHeight = canvasNode.height;
        newWidth = newHeight * wrh;
    }
    var xOffset = newWidth < canvasNode.width ? ((canvasNode.width - newWidth) / 2) : 0;
    var yOffset = newHeight < canvasNode.height ? ((canvasNode.height - newHeight) / 2) : 0;

    return {
        xOffset,
        yOffset,
        newWidth,
        newHeight
    }
}