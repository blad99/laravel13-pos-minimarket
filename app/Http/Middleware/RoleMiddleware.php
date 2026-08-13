<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     * @param  string  $role
     */
    public function handle(Request $request, Closure $next, string $role): Response
    {
        if (!Auth::check()) return redirect('/login');

        /** @var \App\Models\User $user */
        $user = Auth::user();

        if ($user->isAdmin()) return $next($request);

        if ($user->role !== $role) abort(403, 'Unauthorized action. Anda tidak memiliki akses ke halaman ini.');

        return $next($request);
    }
}
