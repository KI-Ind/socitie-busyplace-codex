import fs from 'fs';
import path from 'path';

async function getRegistreToken() {
    const username = process.env.regent_login;
    const password = process.env.regent_password;
    const tokenDir = path.join(process.cwd(), '.cache');
    const tokenPath = path.join(tokenDir, 'regentreprises.txt');

    try {
        // Ensure the cache directory exists
        if (!fs.existsSync(tokenDir)) {
            fs.mkdirSync(tokenDir, { recursive: true });
        }
        // Check if token file exists and is not expired (30 minutes)
        if (fs.existsSync(tokenPath)) {
            const stats = fs.statSync(tokenPath);
            const now = new Date().getTime();
            const fileTime = stats.mtime.getTime();
            
            // If token is still valid (less than 28 minutes old)
            if (now - fileTime < 1680000) {
                return fs.readFileSync(tokenPath, 'utf8');
            }
        }

        // Get new token
        const response = await fetch('https://registre-national-entreprises.inpi.fr/api/sso/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
            throw new Error('Failed to get token');
        }

        const data = await response.json();

        // Save token to file
        if (!fs.existsSync(tokenDir)) {
            fs.mkdirSync(tokenDir, { recursive: true });
        }
        fs.writeFileSync(tokenPath, data.token);
        
        return data.token;
    } catch (error) {
        console.error('Error getting token:', error);
        throw error;
    }
}

export async function getRegistreData(siren: string) {
    try {
        const token = await getRegistreToken();
        
        const response = await fetch(`https://registre-national-entreprises.inpi.fr/api/companies/${siren}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to get company data');
        }

        return await response.json();
    } catch (error) {
        console.error('Error getting company data:', error);
        throw error;
    }
}

export function getRoles(roleId: number): string {
    const roles: { [key: number]: string } = {
        1: "Président",
        2: "Directeur Général",
        3: "Gérant",
        // Add more roles as needed
    };
    return roles[roleId] || "Rôle non spécifié";
}
