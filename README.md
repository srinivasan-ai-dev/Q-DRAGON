# Q-GUARD

**Team Q-DRAGON**
**Smart India Hackathon 2026**
**Problem Statement ID:** SIH26181
**Theme:** MedTech / BioTech / HealthTech
**Category:** Hardware

## Overview
A secure, AI-powered Personal Health Companion that delivers real-time, privacy-preserving health monitoring and early warning capabilities, helping individuals recognize health risks before they become emergencies.

## Proposed Solution: 3-Node Ecosystem
1. **Q-BAND (Day Wearable):** ESP32-S3 wristband tracking vitals (HR, SpO2, Temp) and fall detection. Triggers direct GPS-tagged SOS via 2G SMS without internet.
2. **Q-DOCK (Radar Monitoring):** Bedside unit with 60 GHz mmWave radar for contactless sleep monitoring and vitals analysis.
3. **COMPANION APP (Offline Dashboard):** React Native + SQLite local app for health trends. Zero safety dependency - hardware alerts work even if the phone is missing.

## Core Innovation
- **Contactless 60 GHz mmWave Radar:** Solving the "Overnight Wearable Blindspot" through non-invasive RF micro-sensing.
- **Disaster-Proof SOS:** Uses basic 2G SMS payloads that bypass internet outages and penetrate degraded cellular towers during floods and cyclones.
- **100% Offline Privacy:** Raw health data stays locked in local SQLite storage - zero cloud dependency or data leakage.

## Technical Approach
- **Firmware & Edge Computing:** C/C++ on ESP32-S3, FreeRTOS, TensorFlow Lite Micro, ESP-NN acceleration, Int8-quantized 1D-CNN.
- **Hardware & Sensors:** MAX30102 (HR/SpO2), MPU6050, MAX30205, MR60BHA2 (60GHz mmWave), BME688, SIM800L, NEO-6M.
- **Connectivity:** BLE, 2G SMS, SQLite.
