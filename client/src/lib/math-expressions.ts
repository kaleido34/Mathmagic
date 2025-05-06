// A simple utility to help with math expressions and formatting
import { create, all } from 'mathjs';

// Create a mathjs instance with all functions
const math = create(all);

/**
 * Formats a fraction for display
 * @param numerator The numerator of the fraction
 * @param denominator The denominator of the fraction
 * @returns Formatted fraction string
 */
export function formatFraction(numerator: number, denominator: number): string {
  if (denominator === 0) return 'Undefined';
  if (numerator === 0) return '0';
  if (denominator === 1) return numerator.toString();
  
  // Simplify the fraction
  const gcd = math.gcd(Math.abs(numerator), Math.abs(denominator));
  const simplifiedNumerator = numerator / gcd;
  const simplifiedDenominator = denominator / gcd;
  
  return `${simplifiedNumerator}/${simplifiedDenominator}`;
}

/**
 * Checks if two fractions are equivalent
 * @param num1 First fraction numerator
 * @param den1 First fraction denominator
 * @param num2 Second fraction numerator
 * @param den2 Second fraction denominator
 * @returns True if fractions are equivalent
 */
export function areEquivalentFractions(
  num1: number, 
  den1: number, 
  num2: number, 
  den2: number
): boolean {
  if (den1 === 0 || den2 === 0) return false;
  return (num1 * den2) === (num2 * den1);
}

/**
 * Generates a random fraction with a specified denominator range
 * @param minDenominator Minimum denominator value
 * @param maxDenominator Maximum denominator value
 * @returns An object with numerator and denominator
 */
export function generateRandomFraction(
  minDenominator = 2, 
  maxDenominator = 12
): { numerator: number, denominator: number } {
  const denominator = Math.floor(Math.random() * (maxDenominator - minDenominator + 1)) + minDenominator;
  const numerator = Math.floor(Math.random() * denominator) + 1;
  return { numerator, denominator };
}

/**
 * Generates an equivalent fraction
 * @param numerator Original numerator
 * @param denominator Original denominator
 * @param multiplier Multiplier to create equivalent fraction
 * @returns An object with numerator and denominator
 */
export function generateEquivalentFraction(
  numerator: number, 
  denominator: number,
  multiplier = 2
): { numerator: number, denominator: number } {
  return {
    numerator: numerator * multiplier,
    denominator: denominator * multiplier
  };
}

/**
 * Evaluates a mathematical expression
 * @param expression The expression to evaluate
 * @returns The result or undefined if invalid
 */
export function evaluateExpression(expression: string): number | undefined {
  try {
    return math.evaluate(expression);
  } catch (error) {
    console.error('Error evaluating expression:', error);
    return undefined;
  }
}
