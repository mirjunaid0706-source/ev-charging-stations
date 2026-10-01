@echo off
title WattSquare EV Backend REST API Server
echo ==========================================================
echo    WattSquare ChargeHub - Backend Server Launcher
echo ==========================================================
cd /d "%~dp0"
node server.js
pause
