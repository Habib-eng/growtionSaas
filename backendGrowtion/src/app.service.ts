import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
    getRootPageContent(): string {
      const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>Growtionstore API</title>
        <style>
          body {
            margin: 0;
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #f5f5f5;
            font-family: sans-serif;
          }
          .box {
            padding: 40px 60px;
            background: white;
            border-radius: 16px;
            box-shadow: 0 8px 20px rgba(0,0,0,0.1);
            text-align: center;
            animation: fadeIn 1s ease-in-out;
          }
          .box h1 {
            font-size: 24px;
            color: #333;
          }
          @keyframes fadeIn {
            from {opacity: 0; transform: translateY(-20px);}
            to {opacity: 1; transform: translateY(0);}
          }
        </style>
      </head>
      <body>
        <div class="box">
          <h1>Welcome to Growtionstore 0.0.2 🚀</h1>
        </div>
      </body>
      </html>
      `;
      return html;
    }
}
