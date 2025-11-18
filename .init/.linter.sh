#!/bin/bash
cd /home/kavia/workspace/code-generation/monthly-budget-tracker-40987-40996/frontend_reactjs
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

