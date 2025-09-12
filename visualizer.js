class Visualizer {
    static drawNetwork(ctx, network) {
        // Black background
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        const margin = 50;
        const left = margin;
        const top = margin;
        const width = ctx.canvas.width - margin * 2;
        const height = ctx.canvas.height - margin * 2;

        const levelHeight = height / network.levels.length;

        for (let i = network.levels.length - 1; i >= 0; i--) {
            const levelTop =
                top +
                lerp(
                    height - levelHeight,
                    0,
                    network.levels.length == 1 ? 0.5 : i / (network.levels.length - 1)
                );

            Visualizer.drawLevel(
                ctx,
                network.levels[i],
                left,
                levelTop,
                width,
                levelHeight,
                i == network.levels.length - 1 ? ["↑", "↓", "←", "→"] : []
            );
        }
    }

    static drawLevel(ctx, level, left, top, width, height, outputLabels) {
        const right = left + width;
        const bottom = top + height;

        const { inputs, outputs, weights, biases } = level;

        // Draw connections
        for (let i = 0; i < inputs.length; i++) {
            for (let j = 0; j < outputs.length; j++) {
                const weight = weights[i][j];
                const inputValue = inputs[i];
                const outputValue = outputs[j];
                
                // Check if this connection is "active" (both input and output are firing)
                const isActive = inputValue > 0 && outputValue > 0 && Math.abs(weight) > 0.1;
                
                ctx.beginPath();
                ctx.moveTo(
                    Visualizer.#getNodeX(inputs, i, left, right),
                    bottom
                );
                ctx.lineTo(
                    Visualizer.#getNodeX(outputs, j, left, right),
                    top
                );
                
                if (isActive) {
                    // Active connections - bright and thick
                    ctx.lineWidth = 3;
                    ctx.strokeStyle = weight > 0 ? "rgba(0,255,100,0.8)" : "rgba(255,100,0,0.8)";
                } else if (Math.abs(weight) > 0.1) {
                    // Inactive but significant connections - dimmed
                    ctx.lineWidth = 1.5;
                    ctx.strokeStyle = weight > 0 ? "rgba(0,255,0,0.2)" : "rgba(255,0,0,0.2)";
                } else {
                    // Weak connections - very faint
                    ctx.lineWidth = 1;
                    ctx.strokeStyle = "rgba(255,255,255,0.05)";
                }
                
                ctx.stroke();
            }
        }

        const nodeRadius = 20;

        // Draw input nodes
        for (let i = 0; i < inputs.length; i++) {
            const x = Visualizer.#getNodeX(inputs, i, left, right);
            Visualizer.#drawNode(ctx, x, bottom, inputs[i], nodeRadius);
        }

        // Draw output nodes
        for (let i = 0; i < outputs.length; i++) {
            const x = Visualizer.#getNodeX(outputs, i, left, right);
            Visualizer.#drawNode(ctx, x, top, outputs[i], nodeRadius, biases[i]);

            // Draw output labels
            if (outputLabels[i]) {
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillStyle = "white";
                ctx.font = `${nodeRadius * 1.2}px Arial`;
                ctx.fillText(outputLabels[i], x, top - nodeRadius * 1.5);
            }
        }
    }

    static #drawNode(ctx, x, y, value, radius, bias = null) {
        // White outer circle (always white as requested)
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = "white";
        ctx.fill();
        
        // Black outline for better definition
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.lineWidth = 1;
        ctx.strokeStyle = "rgba(0,0,0,0.3)";
        ctx.stroke();

        // Green dot for firing nodes (as requested)
        if (value > 0) {
            ctx.beginPath();
            ctx.arc(x, y, radius * 0.5, 0, Math.PI * 2);
            ctx.fillStyle = "limegreen";
            ctx.fill();
            
            // Add a subtle glow effect for active nodes
            ctx.beginPath();
            ctx.arc(x, y, radius * 1.1, 0, Math.PI * 2);
            ctx.lineWidth = 2;
            ctx.strokeStyle = "rgba(50,205,50,0.3)";
            ctx.stroke();
        }

        // Bias visualization with dotted lines (as requested)
        if (bias !== null) {
            const biasStrength = Math.abs(bias);
            if (biasStrength > 0.1) {
                ctx.beginPath();
                ctx.arc(x, y, radius * 0.85, 0, Math.PI * 2);
                ctx.lineWidth = 2;
                // Color based on bias direction
                ctx.strokeStyle = bias > 0 ? "rgba(0,255,0,0.4)" : "rgba(255,0,0,0.4)";
                ctx.setLineDash([4, 4]);
                ctx.stroke();
                ctx.setLineDash([]);
            }
        }
    }

    static #getNodeX(nodes, index, left, right) {
        return lerp(
            left,
            right,
            nodes.length == 1 ? 0.5 : index / (nodes.length - 1)
        );
    }
}

function lerp(A, B, t) {
    return A + (B - A) * t;
}