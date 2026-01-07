
// Fix: Augment the existing Process and ProcessEnv interfaces.
// Instead of redeclaring the 'process' variable which can cause conflicts with 
// global types in the environment, we augment the interfaces to include 
// the required API_KEY for process.env.

interface ProcessEnv {
  API_KEY: string;
  [key: string]: string | undefined;
}

interface Process {
  env: ProcessEnv;
}
