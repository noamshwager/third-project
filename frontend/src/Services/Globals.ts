// General globals for development and production: 
abstract class Globals {
    // ...
}

// General globals only for development:
class DevelopmentGlobals extends Globals {
    public vacationsUrl = "http://localhost:3001/api/vacations/";
    public authUrl = "http://localhost:3001/api/auth/";
}

// General globals only for production:
class ProductionGlobals extends Globals {
    public vacationsUrl = "http://localhost:3001/api/vacations/";
    public authUrl = "http://localhost:3001/api/auth/";
}

const globals = process.env.NODE_ENV === "production" ? new ProductionGlobals() : new DevelopmentGlobals();

export default globals;