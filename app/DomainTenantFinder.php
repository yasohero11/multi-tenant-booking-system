<?php

namespace App;

use Spatie\Multitenancy\Models\Tenant;
use Spatie\Multitenancy\TenantFinder\TenantFinder;
use Illuminate\Http\Request;

class DomainTenantFinder extends TenantFinder
{
    public function findForRequest(Request $request): ?Tenant
    {
        $domain = $request->header('X-Tenant-Domain') ?? $request->getHost();

        if ($domain)
            return Tenant::where('domain', $domain)->first();



        if (auth("sanctum")->check()) {
            return Tenant::find(auth("sanctum")->user()->tenant_id);
        }

        return null;
    }
}
