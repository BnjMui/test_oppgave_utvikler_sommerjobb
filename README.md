# test_oppgave_utvikler_sommerjobb

Dette er min løsning til opptaks oppgaven fra Institutt for informatikk og kommunikasjon.

For å løse denne oppgaven har jeg brukt dokumentasjon fra https://modelcontextprotocol.io/introduction og https://modelcontextprotocol.io/quickstart/server

Jeg har for det meste brukt generativ AI for å sjekke små feil i koden som jeg har oversett, generere kode for å hente .env variabler og for å automatisk generere zod schema reglene.

config filer til klienter som Claude desktop eller Cursor behøver en .env variabel med api nøkkel fra Brave search api-et for å brukes.
Filen vil se slik ut:
{
  "mcpServers": {
    "brave-search": {
      "command": "node",
      "args": [
        "C:\\PATH\\TO\\FILE\\INDEX.js"
      ],
      "env": {
        "BRAVE_API_KEY": "YOUR_API_KEY_HERE"
      }
    }
  }
}