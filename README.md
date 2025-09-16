# 🚗 Neural Network Based Self-Driving Car (Built From Scratch)

Ever wondered what happens if you give a car its own brain?  
This project is a fun yet educational attempt at building a **self-driving car simulation** using a neural network — implemented entirely **from scratch**, without using machine learning libraries like TensorFlow or PyTorch.

---

## 📖 Project Overview

This project demonstrates how a car can be trained to **drive itself** using a simple neural network. The entire simulation is coded in **JavaScript**, with custom implementations for car physics, sensors, neural networks, and training logic.

- By default, the simulation runs in **AI mode** where the car drives autonomously.  
- Users can switch to **manual mode** by pressing the **toggle ↳↰ button**, allowing them to directly control the car.  
- A **fitness function** evaluates how well cars avoid collisions and progress along the road.  
- Instead of training one car at a time, the simulation runs **100 cars in parallel** to speed up the discovery of optimal driving strategies.  
- The **best-performing car’s brain** is saved for reuse, while other cars receive mutated versions to explore new possibilities.  
- Over time, the AI improves through this process of **selection, inheritance, and mutation**, mimicking an evolutionary learning approach.  

---

## 🎮 Live Demo

👉 Try it here: [Live Demo Link]  

⚠️ **Important:**  
- This simulation is designed for **laptops/desktops**.  
- It will **not work properly on mobile devices** due to rendering and control limitations.  
- For the best experience, play it on a larger screen.  

---

## 🛠️ Features

- Fully implemented **Neural Network from scratch** in JavaScript  
- Interactive **visualization** of the car’s brain in real-time  
- **Traffic simulation** with dynamic spawning and collision detection  
- Save & discard the **best brain** for iterative training  
- Ability to **toggle between AI-driven mode and manual control**  
- **Parallel training** with 100 cars to reduce trial and error  
- **Mutation mechanism** to encourage exploration of new driving behaviors  
- Smooth animations using `requestAnimationFrame` for rendering  

---

## ⚡ How It Works

1. **Neural Network Initialization**  
   Each car starts with randomly initialized weights and biases.

2. **Fitness Evaluation**  
   A car’s performance is measured by how far it travels without colliding with traffic or road boundaries.

3. **Saving & Mutating Brains**  
   - The best-performing car’s brain is saved in local storage.  
   - On the next trial, all cars inherit this brain.  
   - Mutations are applied to some cars to slightly alter their weights and biases, allowing exploration of alternative strategies.

4. **Iterative Learning**  
   With repeated runs, cars gradually improve driving behavior as the neural network evolves.  

---

## 📂 Project Structure

- `car.js` → Car physics, movement, and control logic  
- `network.js` → Neural network architecture and forward propagation  
- `visualizer.js` → Visual representation of the neural network  
- `main.js` → Simulation setup, training loop, and brain management  
- `road.js` → Road design and lane management  

---

## ⚠️ Limitations

While this project is a fun demonstration of neural networks and simulation, it has some important limitations:

1. **Simplified Physics**  
   - The car physics are highly simplified (no acceleration, braking curves, friction, etc.).  
   - This makes it unrealistic compared to real-world self-driving models.  

2. **Shallow Neural Network**  
   - The network used is small and hand-coded, limiting the complexity of behaviors it can learn.  

3. **No Real-World Data**  
   - The system trains only on the simulated environment.  
   - It cannot generalize to real-world driving conditions.  

4. **Local Storage Training**  
   - Brains are saved in browser local storage, which is not scalable for large experiments.  

5. **Lack of Reinforcement Learning**  
   - Current training is evolutionary (trial-and-error with mutations).  
   - More sophisticated approaches like **Reinforcement Learning (RL)** could yield better results.  

6. **Device Compatibility**  
   - Only works properly on laptops/desktops.  
   - Not optimized for mobile devices or touch controls.  

---

## 🚀 Future Improvements

- Integrate **Reinforcement Learning** for more robust training.  
- Explore **supervised deep learning** methods with real-world driving datasets.  
- Enhance physics with more realistic vehicle dynamics.  
- Add complex environments: multiple lanes, intersections, pedestrians, traffic lights.  
- Implement cloud-based saving for brains instead of local storage.  
- Extend compatibility for tablets and mobile devices.  

---

## 📌 Try It Yourself

Clone the repository:  
```bash
git https://github.com/chitransh100/NeuroDrive
cd NeuroDrive
