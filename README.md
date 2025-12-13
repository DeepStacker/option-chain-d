# Stockify  Trading Platform

## Overview
A sophisticated real-time options trading platform that integrates with Dhan's trading APIs. This platform provides comprehensive options chain data, advanced charting capabilities, and real-time market analysis tools. Built with a modern tech stack, it offers a responsive interface for traders to analyze market data and make informed trading decisions.

## Key Features
- **Real-time Options Chain Data**
  - Live streaming of options data using WebSocket
  - Comprehensive view of calls and puts
  - Strike price analysis
  - Greeks calculations (Delta, Gamma, Theta, Vega)

- **Advanced Market Analysis**
  - BSM (Black-Scholes Model) calculations
  - IV (Implied Volatility) analysis
  - Price movement tracking
  - Future price predictions
  - Reversal pattern detection

- **Interactive Charts**
  - Delta charts
  - IV charts
  - Future price projections
  - Reversal pattern visualization
  - Real-time price updates

- **User Interface**
  - Responsive design with modern aesthetics
  - Dark/Light theme support
  - Customizable data views
  - Real-time ticker updates
  - Interactive data tables

## Tech Stack

### Frontend
- **Core Framework**
  - React.js with modern hooks
  - Redux Toolkit for state management
  - Socket.io-client for real-time data
  - Heroicons for UI elements
  - CSS3 with modern features

- **Components**
  - Custom charting components
  - Reusable UI components
  - Data visualization tools
  - Interactive tables
  - Real-time tickers

### Backend
- **Core**
  - Python Flask
  - Flask-SocketIO
  - Flask-CORS
  - Flask-Caching
  - Flask-Limiter
  - Flask-Compress

- **Data Processing**
  - SciPy for calculations
  - NumPy for numerical operations
  - Custom BSM implementation
  - Data retrieval system

- **Security & Performance**
  - Prometheus monitoring
  - Rate limiting
  - Caching system
  - Compression middleware

## Project Structure

### Backend Structure
```
Backend/
├── APIs.py                 # Main API implementations
├── BSM.py                 # Black-Scholes Model calculations
├── DB_Data_Saver/        # Database operations
├── Reversal_config/      # Reversal pattern configurations
├── Utils.py              # Utility functions
├── Urls.py               # API endpoint definitions
├── new_app.py           # Main application server
└── requirements.txt     # Python dependencies
```

### Frontend Structure
```
Frontend/src/
├── components/
│   ├── DateList.jsx        # Date selection component
│   ├── OptionsTable.jsx    # Main options chain display
│   ├── SpotData.jsx       # Spot price display
│   ├── charts/            # Chart components
│   └── tca/               # Trading cost analysis
├── context/
│   └── dataSlice.js       # Redux state management
├── hooks/                 # Custom React hooks
├── pages/                 # Route pages
└── utils/                 # Utility functions
```

## Installation

### Backend Requirements
```bash
# Core dependencies
Flask==2.0.1
Flask-SocketIO==5.1.1
Flask-CORS==3.0.10
Flask-Caching==2.0.2
Flask-Limiter==3.3.1
Flask-Compress==1.13
scipy
numpy

# Additional dependencies in requirements.txt
```

### Frontend Requirements
```bash
# Core dependencies
react
react-redux
@reduxjs/toolkit
socket.io-client
axios
@heroicons/react

# Development dependencies
vite
```

## Setup Instructions

### Backend Setup
1. Create virtual environment:
```bash
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Configure environment variables:
```env
FLASK_APP=new_app.py
FLASK_ENV=development
```

### Frontend Setup
1. Install dependencies:
```bash
cd Frontend
npm install
```

2. Configure environment:
```bash
cp .env.example .env
# Edit .env with your API endpoints
```

## Running the Application

### Development Mode
1. Start Backend:
```bash
cd Backend
python new_app.py
```

2. Start Frontend:
```bash
cd Frontend
npm run dev
```

### Production Mode
1. Build Frontend:
```bash
cd Frontend
npm run build
```

2. Start Backend with Gunicorn:
```bash
gunicorn -k geventwebsocket.gunicorn.workers.GeventWebSocketWorker -w 1 new_app:app
```

## API Documentation

### WebSocket Events
- `connect`: Client connection initialization
- `disconnect`: Client disconnection handling
- `start_streaming`: Begin real-time data stream
- `stop_streaming`: Stop data stream
- `error`: Error event handling

### HTTP Endpoints
- `GET /api/live-data/`: Fetch live market data
- `GET /api/exp-date/`: Get expiry dates
- `GET /api/option-chain/`: Get option chain data
- `GET /api/spot-data/`: Get spot prices
- `GET /api/future-data/`: Get futures data

## Configuration
- Rate limiting: 100 requests per minute
- Cache duration: 5 minutes for static data
- WebSocket ping interval: 25 seconds
- WebSocket timeout: 30 seconds

## Security Features
- CORS protection
- Rate limiting
- API key validation
- Error logging
- Request validation

## Performance Optimization
- Response compression
- Data caching
- Efficient WebSocket management
- Optimized state updates
- Lazy loading of components

## Monitoring
- Prometheus metrics
- Rotating log files
- Error tracking
- Performance monitoring

## Contributing
1. Fork the repository
2. Create feature branch
3. Follow coding standards
4. Write tests
5. Submit pull request

## Development Guidelines
- Follow React best practices
- Use TypeScript for new components
- Maintain test coverage
- Document API changes
- Follow semantic versioning

## License
[Add your license information]

## Support
[Add your support contact information]

## Acknowledgments
- Stockify  team
- Contributors
- Open source community
